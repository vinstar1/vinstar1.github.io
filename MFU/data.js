// 本地 Mock 静态数据，结构参考 IMG_4294 穴位卡片
// 字段说明：
//   mfu     - 穴位编号（如 AN-CP1）
//   cc      - Clinical Context：解剖定位描述
//   treatment.patient  - 患者体位
//   treatment.therapist - 治疗师操作手法
// 未来从 Excel 导入数据后，可直接替换此 muscles/acupoints 对象

window.appData = {
    // 肌肉系统集合
    muscles: [
        {
            id: 'm1_trapezius',
            name: '斜方肌 (Trapezius)',
            region: '背部肌群',
            description: '位于上背及中背的表层肌肉，呈三角形。属于重要的筋膜网络枢纽，负责肩胛骨的升降、回旋及内收。此处筋膜网常因久坐劳损而粘连硬化。',
            modelKeywords: ['trapezius'],
            // 热点在左侧解剖图上的位置（百分比），以解剖图容器为基准
            hotspot: { x: 50, y: 22 },
            acupoints: ['acu_jianjing', 'acu_fengchi', 'acu_tianliao']
        },
        {
            id: 'm2_deltoid',
            name: '三角肌 (Deltoid)',
            region: '臂部肌群',
            description: '覆盖包裹肩关节的多兵种肌肉，分为前中后三束，形状如三角形。此处的筋膜张力对肩部整体灵活性影响极大。',
            modelKeywords: ['deltoid'],
            hotspot: { x: 22, y: 30 },
            acupoints: ['acu_jianliao', 'acu_jianyu']
        },
        {
            id: 'm3_latissimus',
            name: '背阔肌 (Latissimus Dorsi)',
            region: '背部肌群',
            description: '下背部的大面积扇贝状肌肉，人体最宽大的肌肉。连接胸腰筋膜，向上附着在肱骨，对拉伸运动至关重要，是后背筋膜链的核心受力带。',
            modelKeywords: ['latissimus dorsi', 'latissimus'],
            hotspot: { x: 50, y: 48 },
            acupoints: ['acu_tiangzong', 'acu_pishu']
        }
    ],

    // 穴位详略字典
    // 字段说明（参考 IMG_4294 卡片结构）：
    //   mfu       - 穴位编号
    //   name      - 穴位名称（中英文）
    //   cc        - Clinical Context（解剖定位说明）
    //   treatment.patient   - 患者体位
    //   treatment.therapist - 治疗师操作手法
    //   notes     - 补充备注
    acupoints: {
        'acu_jianjing': {
            id: 'acu_jianjing',
            mfu: 'AN-SH1',
            name: '肩井穴 (Jianjing)',
            meridian: '足少阳胆经 · GB21',
            cc: '大椎与肩峰端连线中点，斜方肌肌腹最高处。',
            treatment: {
                patient: '坐位，颈部自然放松。',
                therapist: '位于患者身后，以拇指或肘尖施力，沿斜方肌肌纤维方向缓慢按压。'
            },
            notes: ''
        },
        'acu_fengchi': {
            id: 'acu_fengchi',
            mfu: 'AN-NE1',
            name: '风池穴 (Fengchi)',
            meridian: '足少阳胆经 · GB20',
            cc: '枕骨之下，与风府穴相平，胸锁乳突肌与斜方肌上端之间的凹陷处。',
            treatment: {
                patient: '俯卧或坐位，头部稍前倾。',
                therapist: '双手拇指同时置于双侧风池，针尖微下向鼻尖方向施压 0.8~1.2 寸，配合患者均匀呼吸。'
            },
            notes: ''
        },
        'acu_tianliao': {
            id: 'acu_tianliao',
            mfu: 'AN-SH2',
            name: '天髎穴 (Tianliao)',
            meridian: '手少阳三焦经 · SJ15',
            cc: '肩胛区，肩井与曲垣的中间，斜方肌外上方。',
            treatment: {
                patient: '坐位或俯卧，肩部放松下垂。',
                therapist: '站于患侧，以食指或拇指直刺 0.5~1 寸，配合肩胛骨运动可增强松解效果。'
            },
            notes: ''
        },
        'acu_jianliao': {
            id: 'acu_jianliao',
            mfu: 'AN-SH3',
            name: '肩髎穴 (Jianliao)',
            meridian: '手少阳三焦经 · SJ14',
            cc: '肩关节后下方，肩峰角下方，三角肌后侧凹陷处。',
            treatment: {
                patient: '坐位，屈肘 90° 自然置于大腿上。',
                therapist: '位于患侧，直刺 1~1.5 寸，手法以得气为佳，可配合留针。'
            },
            notes: ''
        },
        'acu_jianyu': {
            id: 'acu_jianyu',
            mfu: 'AN-SH4',
            name: '肩髃穴 (Jianyu)',
            meridian: '手阳明大肠经 · LI15',
            cc: '肩峰端下缘，三角肌起始部，平举时前凹陷处。',
            treatment: {
                patient: '坐位，患肢前举 90°，暴露穴区。',
                therapist: '直刺或向下斜刺 0.8~1.5 寸，沿三角肌肌纤维方向松解。'
            },
            notes: ''
        },
        'acu_tiangzong': {
            id: 'acu_tiangzong',
            mfu: 'AN-BA1',
            name: '天宗穴 (Tianzong)',
            meridian: '手太阳小肠经 · SI11',
            cc: '肩胛区，肩胛冈中点与肩胛骨下角连线上 1/3 与下 2/3 交点凹陷中，背阔肌斜度上方。',
            treatment: {
                patient: '俯卧，双臂自然置于体侧。',
                therapist: '位于患侧，直刺或斜刺 0.5~1 寸，按压时可使患者出现肩背部放射性酸胀。'
            },
            notes: ''
        },
        'acu_pishu': {
            id: 'acu_pishu',
            mfu: 'AN-BA2',
            name: '脾俞穴 (Pishu)',
            meridian: '足太阳膀胱经 · BL20',
            cc: '第 11 胸椎棘突下，旁开 1.5 寸，深层为背阔肌及竖脊肌。',
            treatment: {
                patient: '俯卧，腹部垫薄枕以松弛腰背部肌群。',
                therapist: '斜刺 0.5~0.8 寸，手法宜缓，避免深刺伤及内脏。'
            },
            notes: ''
        }
    }
};
