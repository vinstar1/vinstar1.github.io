import * as THREE from 'three';

const appData = window.appData;
const MODEL_URLS = [
    'assets/models/anatomy-high.glb',
    './assets/models/anatomy-high.glb',
    'https://cdn.jsdelivr.net/gh/thisisharshith/anatomy-viewer@main/public/models/model.glb',
    'https://raw.githubusercontent.com/thisisharshith/anatomy-viewer/main/public/models/model.glb'
];
const ORBIT_CONTROLS_URLS = [
    'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/OrbitControls.js',
    'https://raw.githubusercontent.com/mrdoob/three.js/r161/examples/jsm/controls/OrbitControls.js'
];
const GLTF_LOADER_URLS = [
    'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/loaders/GLTFLoader.js',
    'https://raw.githubusercontent.com/mrdoob/three.js/r161/examples/jsm/loaders/GLTFLoader.js'
];
const DRACO_LOADER_URLS = [
    'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/loaders/DRACOLoader.js',
    'https://raw.githubusercontent.com/mrdoob/three.js/r161/examples/jsm/loaders/DRACOLoader.js'
];
const DRACO_DECODER_BASES = [
    'assets/draco/',
    './assets/draco/',
    'https://www.gstatic.com/draco/versioned/decoders/1.5.7/',
    'https://www.gstatic.com/draco/v1/decoders/',
    'https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/libs/draco/'
];

let currentMuscleId = null;
let OrbitControlsCtor = null;
let GLTFLoaderCtor = null;
let DRACOLoaderCtor = null;

const viewer = {
    container: null,
    loadingEl: null,
    loadingTextEl: null,
    statusEl: null,
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    raycaster: new THREE.Raycaster(),
    pointer: new THREE.Vector2(),
    pickableMeshes: [],
    muscleNodeMap: new Map(),
    modelRoot: null,
    muscleSystemRoot: null,
    highlightedMeshes: new Set(),
    dragState: { downX: 0, downY: 0, downAt: 0 },
    focusTween: null
};

document.addEventListener('DOMContentLoaded', async () => {
    const addonsReady = await loadThreeAddons();
    if (!addonsReady) return;
    initSearch();
    initViewer();
    await loadAnatomyModel();
});

async function loadThreeAddons() {
    updateLoadingText('正在初始化 3D 引擎...');

    const [orbitModule, gltfModule, dracoModule] = await Promise.all([
        importFirstAvailable(ORBIT_CONTROLS_URLS),
        importFirstAvailable(GLTF_LOADER_URLS),
        importFirstAvailable(DRACO_LOADER_URLS)
    ]);

    OrbitControlsCtor = orbitModule?.OrbitControls || null;
    GLTFLoaderCtor = gltfModule?.GLTFLoader || null;
    DRACOLoaderCtor = dracoModule?.DRACOLoader || null;

    if (!OrbitControlsCtor || !GLTFLoaderCtor || !DRACOLoaderCtor) {
        hideLoading();
        showViewerStatus('3D 引擎模块加载失败，请检查网络后刷新。', true);
        return false;
    }
    return true;
}

async function importFirstAvailable(urls) {
    for (const url of urls) {
        try {
            return await import(url);
        } catch (error) {
            console.warn('[MFU] 模块加载失败:', url, error);
        }
    }
    return null;
}

function initViewer() {
    viewer.container = document.getElementById('viewer-3d');
    viewer.loadingEl = document.getElementById('viewer-loading');
    viewer.loadingTextEl = document.getElementById('viewer-loading-text');
    viewer.statusEl = document.getElementById('viewer-status');

    if (!viewer.container || !window.WebGLRenderingContext) {
        hideLoading();
        showViewerStatus('当前浏览器不支持 WebGL，无法渲染 3D 解剖模型。', true);
        return;
    }

    viewer.scene = new THREE.Scene();
    viewer.scene.background = null;

    const width = viewer.container.clientWidth || 1;
    const height = viewer.container.clientHeight || 1;

    viewer.camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 500);
    viewer.camera.position.set(0, 1.3, 3.6);

    viewer.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    viewer.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    viewer.renderer.setSize(width, height);
    viewer.renderer.outputColorSpace = THREE.SRGBColorSpace;
    viewer.container.appendChild(viewer.renderer.domElement);

    viewer.controls = new OrbitControlsCtor(viewer.camera, viewer.renderer.domElement);
    viewer.controls.enableDamping = true;
    viewer.controls.dampingFactor = 0.06;
    viewer.controls.rotateSpeed = 0.7;
    viewer.controls.zoomSpeed = 0.8;
    viewer.controls.panSpeed = 0.6;
    viewer.controls.minDistance = 0.45;
    viewer.controls.maxDistance = 7;
    viewer.controls.target.set(0, 1.1, 0);
    viewer.controls.update();

    const hemi = new THREE.HemisphereLight(0xffffff, 0x8f99a8, 1.2);
    viewer.scene.add(hemi);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(4, 6, 5);
    viewer.scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xbfd2ff, 0.55);
    fillLight.position.set(-5, 2, -4);
    viewer.scene.add(fillLight);

    viewer.container.addEventListener('pointerdown', onPointerDown);
    viewer.container.addEventListener('pointerup', onPointerUp);
    window.addEventListener('resize', onResize);

    animate();
}

async function loadAnatomyModel() {
    if (!viewer.scene || !viewer.renderer) return;

    const loader = new GLTFLoaderCtor();
    const dracoLoader = await createDracoLoader();
    if (dracoLoader) {
        loader.setDRACOLoader(dracoLoader);
    }
    let gltf = null;
    let lastError = null;
    const errorDetails = [];

    for (let i = 0; i < MODEL_URLS.length; i++) {
        const url = MODEL_URLS[i];
        try {
            gltf = await loadModel(loader, url);
            break;
        } catch (error) {
            lastError = error;
            const msg = error?.message || String(error);
            errorDetails.push(`${url} -> ${msg}`);
            console.warn('[MFU] 模型加载失败:', url, error);
        }
    }

    if (!gltf) {
        hideLoading();
        const detail = errorDetails[0] || (lastError?.message || 'unknown error');
        showViewerStatus(`高精度解剖模型加载失败：${detail}`, true);
        if (lastError) console.error(lastError);
        return;
    }

    const root = gltf.scene;
    viewer.modelRoot = root;
    normalizeModel(root);
    isolateToMuscleSystem(root);
    viewer.scene.add(root);

    viewer.pickableMeshes = [];
    const pickRoot = viewer.muscleSystemRoot || root;
    pickRoot.traverse((node) => {
        if (!node.isMesh) return;
        if (!node.visible) return;
        viewer.pickableMeshes.push(node);
    });

    buildMuscleNodeMap(root);
    hideLoading();
    showViewerStatus('已切换为肌肉系统模型。拖拽旋转、滚轮缩放，点击肌肉查看右侧信息。');
}

async function createDracoLoader() {
    if (!DRACOLoaderCtor) return null;

    const decoderBase = await resolveAvailableDecoderBase();
    const dracoLoader = new DRACOLoaderCtor();
    dracoLoader.setDecoderPath(decoderBase);
    dracoLoader.setDecoderConfig({ type: 'js' });
    dracoLoader.preload();
    return dracoLoader;
}

async function resolveAvailableDecoderBase() {
    for (const base of DRACO_DECODER_BASES) {
        try {
            const response = await fetch(`${base}draco_decoder.js`, { cache: 'no-store' });
            if (response.ok) return base;
        } catch (error) {
            console.warn('[MFU] Draco decoder 不可用:', base, error);
        }
    }
    return DRACO_DECODER_BASES[DRACO_DECODER_BASES.length - 1];
}

function loadModel(loader, url) {
    return new Promise((resolve, reject) => {
        loader.load(
            url,
            resolve,
            (progressEvent) => {
                if (!progressEvent || !progressEvent.total) {
                    updateLoadingText('正在加载高精度解剖 3D 模型...');
                    return;
                }
                const pct = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                updateLoadingText(`正在加载高精度解剖 3D 模型... ${pct}%`);
            },
            reject
        );
    });
}

function normalizeModel(root) {
    const bbox = new THREE.Box3().setFromObject(root);
    const size = bbox.getSize(new THREE.Vector3());
    const center = bbox.getCenter(new THREE.Vector3());

    root.position.sub(center);
    if (size.y > 0) {
        const scale = 2.35 / size.y;
        root.scale.setScalar(scale);
    }
    root.rotation.y = Math.PI;
}

function isolateToMuscleSystem(root) {
    let muscleSystem = null;
    root.traverse((node) => {
        const name = (node.name || '').toLowerCase();
        if (!muscleSystem && name.includes('muscles subgroup')) {
            muscleSystem = node;
        }
    });

    if (!muscleSystem) {
        root.traverse((node) => {
            const name = (node.name || '').toLowerCase();
            if (name === 'cube' || name.startsWith('text') || name.includes('penis')) {
                node.visible = false;
            }
        });
        return;
    }

    viewer.muscleSystemRoot = muscleSystem;

    root.traverse((node) => {
        node.visible = false;
    });

    let cursor = muscleSystem;
    while (cursor) {
        cursor.visible = true;
        if (cursor === root) break;
        cursor = cursor.parent;
    }

    muscleSystem.traverse((node) => {
        const name = (node.name || '').toLowerCase();
        if (name.startsWith('text') || name.includes('penis')) {
            node.visible = false;
        }
    });
}

function buildMuscleNodeMap(root) {
    const namedNodes = [];
    const searchRoot = viewer.muscleSystemRoot || root;
    searchRoot.traverse((node) => {
        if (node.name) namedNodes.push(node);
    });

    appData.muscles.forEach((muscle) => {
        const keywords = (muscle.modelKeywords || [])
            .map((keyword) => keyword.toLowerCase().trim())
            .filter(Boolean);

        if (keywords.length === 0) return;

        const matchedNodes = namedNodes.filter((node) => {
            const nodeName = node.name.toLowerCase();
            return keywords.some((keyword) => nodeName.includes(keyword));
        });

        if (matchedNodes.length === 0) return;
        viewer.muscleNodeMap.set(muscle.id, matchedNodes);

        matchedNodes.forEach((node) => {
            node.traverse((child) => {
                if (child.isMesh) {
                    child.userData.mfuMuscleId = muscle.id;
                }
            });
        });
    });
}

function onPointerDown(event) {
    viewer.dragState.downX = event.clientX;
    viewer.dragState.downY = event.clientY;
    viewer.dragState.downAt = Date.now();
}

function onPointerUp(event) {
    const dx = Math.abs(event.clientX - viewer.dragState.downX);
    const dy = Math.abs(event.clientY - viewer.dragState.downY);
    const dt = Date.now() - viewer.dragState.downAt;
    if (dx > 6 || dy > 6 || dt > 350) return;

    const rect = viewer.container.getBoundingClientRect();
    viewer.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    viewer.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    viewer.raycaster.setFromCamera(viewer.pointer, viewer.camera);
    const intersections = viewer.raycaster.intersectObjects(viewer.pickableMeshes, true);
    if (!intersections.length) return;

    const targetMesh = intersections[0].object;
    const muscleId = getMuscleIdFromObject(targetMesh);
    if (muscleId) {
        selectMuscle(muscleId);
        return;
    }

    selectUnknownMuscle(targetMesh);
}

function getMuscleIdFromObject(object3d) {
    let cursor = object3d;
    while (cursor) {
        if (cursor.userData?.mfuMuscleId) return cursor.userData.mfuMuscleId;
        cursor = cursor.parent;
    }

    cursor = object3d;
    while (cursor) {
        const nodeName = (cursor.name || '').toLowerCase();
        if (nodeName) {
            const matchedMuscle = appData.muscles.find((muscle) => {
                const keywords = muscle.modelKeywords || [];
                return keywords.some((keyword) => nodeName.includes(keyword.toLowerCase()));
            });
            if (matchedMuscle) return matchedMuscle.id;
        }
        cursor = cursor.parent;
    }

    return null;
}

function selectMuscle(muscleId) {
    if (!muscleId || currentMuscleId === muscleId) return;
    currentMuscleId = muscleId;

    renderRightPanel(muscleId);
    highlightMuscle(muscleId);
    focusMuscle(muscleId);
}

function selectUnknownMuscle(targetMesh) {
    currentMuscleId = null;
    const group = getHighlightGroupFromObject(targetMesh);
    const displayName = getReadableNodeName(group?.name || targetMesh?.name || '肌肉组织');

    clearHighlight();
    highlightObjectGroup(group || targetMesh);
    focusObjectGroup(group || targetMesh);
    renderFallbackPanel(displayName);
}

function highlightMuscle(muscleId) {
    clearHighlight();
    const nodes = viewer.muscleNodeMap.get(muscleId) || [];
    nodes.forEach((node) => highlightObjectGroup(node));
}

function highlightObjectGroup(group) {
    if (!group) return;
    group.traverse((child) => {
        if (!child.isMesh) return;
        activateHighlightMaterial(child);
        viewer.highlightedMeshes.add(child);
    });
}

function getHighlightGroupFromObject(object3d) {
    let cursor = object3d;
    while (cursor) {
        const rawName = (cursor.name || '').trim();
        const name = rawName.toLowerCase();
        const isGoodName = rawName &&
            !name.startsWith('mesh') &&
            !name.startsWith('text') &&
            !name.includes('subgroup') &&
            name !== 'cube';

        if (isGoodName) return cursor;
        if (cursor === viewer.muscleSystemRoot) return cursor;
        cursor = cursor.parent;
    }
    return object3d;
}

function getReadableNodeName(name) {
    if (!name) return '肌肉组织';
    const clean = String(name).replace(/[_]+/g, ' ').replace(/\s+/g, ' ').trim();
    const lower = clean.toLowerCase();
    if (!clean || lower.startsWith('mesh') || lower.includes('subgroup') || lower === 'cube') {
        return '肌肉组织';
    }
    return clean;
}

function activateHighlightMaterial(mesh) {
    if (!mesh.userData.mfuOriginalMaterial) {
        mesh.userData.mfuOriginalMaterial = mesh.material;
        mesh.material = Array.isArray(mesh.material)
            ? mesh.material.map((mat) => mat.clone())
            : mesh.material.clone();
    }

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => {
        if (material.color) material.color.offsetHSL(-0.015, 0.08, 0.04);
        if ('emissive' in material) {
            material.emissive.set('#ff5d38');
            material.emissiveIntensity = 0.45;
        }
    });
}

function clearHighlight() {
    viewer.highlightedMeshes.forEach((mesh) => {
        if (!mesh.userData.mfuOriginalMaterial) return;
        const highlightedMaterial = mesh.material;
        mesh.material = mesh.userData.mfuOriginalMaterial;
        delete mesh.userData.mfuOriginalMaterial;

        if (Array.isArray(highlightedMaterial)) {
            highlightedMaterial.forEach((mat) => mat.dispose?.());
        } else {
            highlightedMaterial.dispose?.();
        }
    });
    viewer.highlightedMeshes.clear();
}

function focusMuscle(muscleId) {
    const nodes = viewer.muscleNodeMap.get(muscleId);
    if (!nodes || nodes.length === 0 || !viewer.controls) return;

    const box = new THREE.Box3();
    nodes.forEach((node) => box.expandByObject(node));
    focusByBox(box);
}

function focusObjectGroup(group) {
    if (!group) return;
    const box = new THREE.Box3().setFromObject(group);
    focusByBox(box);
}

function focusByBox(box) {
    if (!viewer.controls || !box || box.isEmpty()) return;

    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const radius = Math.max(size.x, size.y, size.z) * 1.15;
    const distance = Math.max(radius * 2.1, 0.8);

    const dir = new THREE.Vector3()
        .subVectors(viewer.camera.position, viewer.controls.target)
        .normalize();
    const targetPosition = center.clone().add(dir.multiplyScalar(distance));

    viewer.focusTween = {
        startAt: performance.now(),
        duration: 550,
        fromTarget: viewer.controls.target.clone(),
        toTarget: center,
        fromPosition: viewer.camera.position.clone(),
        toPosition: targetPosition
    };
}

function animate() {
    requestAnimationFrame(animate);
    if (!viewer.renderer || !viewer.scene || !viewer.camera || !viewer.controls) return;

    if (viewer.focusTween) {
        const elapsed = performance.now() - viewer.focusTween.startAt;
        const t = Math.min(elapsed / viewer.focusTween.duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);

        viewer.controls.target.lerpVectors(viewer.focusTween.fromTarget, viewer.focusTween.toTarget, eased);
        viewer.camera.position.lerpVectors(viewer.focusTween.fromPosition, viewer.focusTween.toPosition, eased);

        if (t >= 1) viewer.focusTween = null;
    }

    viewer.controls.update();
    viewer.renderer.render(viewer.scene, viewer.camera);
}

function onResize() {
    if (!viewer.container || !viewer.renderer || !viewer.camera) return;
    const width = viewer.container.clientWidth || 1;
    const height = viewer.container.clientHeight || 1;
    viewer.camera.aspect = width / height;
    viewer.camera.updateProjectionMatrix();
    viewer.renderer.setSize(width, height);
}

function updateLoadingText(text) {
    if (viewer.loadingTextEl) viewer.loadingTextEl.textContent = text;
}

function hideLoading() {
    if (!viewer.loadingEl) return;
    viewer.loadingEl.classList.add('hidden');
}

function showViewerStatus(text, isError = false) {
    if (!viewer.statusEl) return;
    viewer.statusEl.textContent = text;
    viewer.statusEl.classList.remove('hidden');
    viewer.statusEl.classList.toggle('error', isError);
}

function renderRightPanel(muscleId) {
    const muscle = appData.muscles.find((m) => m.id === muscleId);
    if (!muscle) return;

    document.getElementById('empty-state').style.display = 'none';
    const wrapper = document.getElementById('detail-wrapper');
    wrapper.classList.remove('hidden');

    wrapper.style.animation = 'none';
    void wrapper.offsetWidth;
    wrapper.style.animation = '';

    document.getElementById('muscle-title').textContent = muscle.name;
    document.getElementById('muscle-region').textContent = muscle.region;
    document.getElementById('muscle-desc').textContent = muscle.description;

    const acuList = document.getElementById('acu-list');
    acuList.innerHTML = '';

    muscle.acupoints.forEach((acuId) => {
        const acu = appData.acupoints[acuId];
        if (acu) acuList.appendChild(buildAcuItem(acu));
    });

    document.getElementById('panel-content').scrollTop = 0;
}

function renderFallbackPanel(muscleName) {
    document.getElementById('empty-state').style.display = 'none';
    const wrapper = document.getElementById('detail-wrapper');
    wrapper.classList.remove('hidden');

    wrapper.style.animation = 'none';
    void wrapper.offsetWidth;
    wrapper.style.animation = '';

    document.getElementById('muscle-title').textContent = muscleName || '肌肉组织';
    document.getElementById('muscle-region').textContent = '肌肉系统';
    document.getElementById('muscle-desc').textContent = '该肌肉部位已定位，但该条目的穴位关联数据暂未录入。';

    const acuList = document.getElementById('acu-list');
    acuList.innerHTML = `
        <div class="acu-item expanded">
            <div class="acu-header">
                <div class="acu-name-block">
                    <div class="acu-dot"></div>
                    <span class="acu-name">暂无穴位数据</span>
                </div>
            </div>
            <div class="acu-body" style="max-height:220px">
                <div class="acu-content">
                    <table class="acu-info-table">
                        <tr>
                            <td class="row-label">说明</td>
                            <td class="row-value">后续可在 data.js 中补充该肌肉的穴位、CC 与治疗信息。</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    `;

    document.getElementById('panel-content').scrollTop = 0;
}

function buildAcuItem(acu) {
    const item = document.createElement('div');
    item.className = 'acu-item';
    item.id = `acu-card-${acu.id}`;

    const emptyPlaceholder = '<span class="empty-field">待补充</span>';
    const cc = acu.cc ? escapeHtml(acu.cc) : emptyPlaceholder;
    const patient = acu.treatment?.patient ? escapeHtml(acu.treatment.patient) : emptyPlaceholder;
    const therapist = acu.treatment?.therapist ? escapeHtml(acu.treatment.therapist) : emptyPlaceholder;
    const notes = acu.notes ? escapeHtml(acu.notes) : emptyPlaceholder;

    item.innerHTML = `
        <div class="acu-header">
            <div class="acu-name-block">
                <div class="acu-dot"></div>
                <span class="acu-name">${escapeHtml(acu.name)}</span>
                <span class="acu-mfu-tag">${escapeHtml(acu.mfu || '--')}</span>
            </div>
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"/>
            </svg>
        </div>
        <div class="acu-body">
            <div class="acu-content">
                <table class="acu-info-table">
                    <tr>
                        <td class="row-label">MFU</td>
                        <td class="row-value">${escapeHtml(acu.mfu || '--')} &nbsp;<small style="color:var(--text-secondary)">${escapeHtml(acu.meridian || '')}</small></td>
                    </tr>
                    <tr>
                        <td class="row-label">CC</td>
                        <td class="row-value">${cc}</td>
                    </tr>
                </table>
                <span class="treatment-header">治疗</span>
                <table class="acu-info-table">
                    <tr>
                        <td class="row-label">患者</td>
                        <td class="row-value">${patient}</td>
                    </tr>
                    <tr>
                        <td class="row-label">治疗师</td>
                        <td class="row-value">${therapist}</td>
                    </tr>
                    <tr>
                        <td class="row-label">备注</td>
                        <td class="row-value">${notes}</td>
                    </tr>
                </table>
            </div>
        </div>
    `;

    item.querySelector('.acu-header').addEventListener('click', () => {
        const isExpanded = item.classList.contains('expanded');
        document.querySelectorAll('.acu-item.expanded').forEach((el) => el.classList.remove('expanded'));
        if (!isExpanded) item.classList.add('expanded');
    });

    return item;
}

function initSearch() {
    const input = document.getElementById('global-search');
    const results = document.getElementById('search-results');

    const index = [];
    appData.muscles.forEach((muscle) => {
        index.push({ type: 'muscle', label: muscle.name, muscleId: muscle.id });
    });
    Object.values(appData.acupoints).forEach((acu) => {
        const parentMuscle = appData.muscles.find((muscle) => muscle.acupoints.includes(acu.id));
        index.push({ type: 'acu', label: acu.name, mfu: acu.mfu, muscleId: parentMuscle?.id, acuId: acu.id });
    });

    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        results.innerHTML = '';
        if (!q) {
            results.classList.add('hidden');
            return;
        }

        const matched = index.filter((item) => item.label.toLowerCase().includes(q));
        if (matched.length === 0) {
            results.innerHTML = '<div class="search-item" style="color:var(--text-secondary)">未找到匹配的肌肉或穴位</div>';
        } else {
            matched.forEach((item) => {
                const div = document.createElement('div');
                div.className = 'search-item';
                div.innerHTML = `
                    <span class="search-type-badge">${item.type === 'muscle' ? '肌肉' : '穴位'}</span>
                    ${item.mfu ? `<small style="color:var(--text-secondary);margin-right:4px">${item.mfu}</small>` : ''}
                    ${escapeHtml(item.label)}
                `;

                div.addEventListener('click', () => {
                    input.value = '';
                    results.classList.add('hidden');
                    if (!item.muscleId) return;

                    selectMuscle(item.muscleId);
                    if (item.type === 'acu' && item.acuId) {
                        setTimeout(() => {
                            const card = document.getElementById(`acu-card-${item.acuId}`);
                            if (!card) return;
                            document.querySelectorAll('.acu-item.expanded').forEach((el) => el.classList.remove('expanded'));
                            card.classList.add('expanded');
                            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }, 260);
                    }
                });

                results.appendChild(div);
            });
        }

        results.classList.remove('hidden');
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.search-box')) results.classList.add('hidden');
    });

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            results.querySelector('.search-item')?.click();
        }
    });
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}
