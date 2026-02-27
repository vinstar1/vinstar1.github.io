const { NodeIO } = require('@gltf-transform/core');
const fs = require('fs');

async function main() {
    const io = new NodeIO();
    const document = await io.read('/Users/macbook/Documents/code/vinstar1.github.io-hexo/source/MFU/assets/models/anatomy-high.glb');
    const root = document.getRoot();
    
    console.log("Scenes:");
    for (const scene of root.listScenes()) {
        console.log("Scene:", scene.getName());
        for (const child of scene.listChildren()) {
            console.log("  Child Node:", child.getName(), "Translation:", child.getTranslation());
        }
    }
}
main().catch(console.error);
