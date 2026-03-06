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
            id: 'grp_head_face',
            name: '头面区 (Head & Face)',
            region: '头面肌群',
            description: '对应头面浅层与咀嚼肌区域，集中显示面部、眶周、下颌与枕部相关穴位。',
            modelKeywords: ['temporalis', 'masseter', 'platysma', 'orbicularis', 'frontalis'],
            mfuSegments: ['CP1', 'CP2', 'CP3']
        },
        {
            id: 'grp_neck_cervical',
            name: '颈项区 (Neck)',
            region: '颈项肌群',
            description: '覆盖胸锁乳突肌、颈夹肌、项韧带等颈项结构，适合查看颈前与颈后线相关穴位。',
            modelKeywords: ['sternocleidomastoid', 'splenius', 'semispinalis', 'scalene', 'trapezius'],
            mfuSegments: ['CL']
        },
        {
            id: 'grp_chest_shoulder',
            name: '胸肩区 (Chest & Shoulder)',
            region: '胸肩肌群',
            description: '整合胸大肌、胸小肌、三角肌与肩胛带肌群，对应胸廓前侧和肩带区域穴位。',
            modelKeywords: ['pectoralis', 'serratus', 'subclavius', 'deltoid', 'supraspinatus', 'infraspinatus', 'subscapularis', 'rhomboid', 'teres'],
            mfuSegments: ['TH', 'SC']
        },
        {
            id: 'grp_abdomen_lumbar',
            name: '腹腰区 (Abdomen & Lumbar)',
            region: '核心肌群',
            description: '覆盖腹直肌、腹斜肌、腰方肌与腰背交界区域，用于查看腹部和腰段相关穴位。',
            modelKeywords: ['rectus abdominis', 'oblique', 'transversus', 'erector', 'quadratus', 'latissimus dorsi'],
            mfuSegments: ['LU']
        },
        {
            id: 'grp_pelvis_hip',
            name: '骨盆髋区 (Pelvis & Hip)',
            region: '骨盆髋肌群',
            description: '覆盖髂腰肌、臀大肌、臀中肌与骶尾周围区域，对应骨盆与髋部穴位。',
            modelKeywords: ['gluteus', 'iliacus', 'psoas', 'tensor fasciae latae', 'piriformis'],
            mfuSegments: ['PV']
        },
        {
            id: 'grp_upper_arm',
            name: '上臂区 (Upper Arm)',
            region: '上臂肌群',
            description: '覆盖肱二头肌、肱肌、肱三头肌与喙肱肌，对应上臂近端到肘上的穴位。',
            modelKeywords: ['biceps brachii', 'triceps', 'brachialis', 'coracobrachialis'],
            mfuSegments: ['HU', 'CU']
        },
        {
            id: 'grp_forearm_hand',
            name: '前臂手区 (Forearm & Hand)',
            region: '前臂手部肌群',
            description: '覆盖前臂屈肌群、伸肌群、旋前肌与手部小肌群，对应前臂远近端和手部穴位。',
            modelKeywords: ['brachioradialis', 'pronator', 'flexor', 'extensor', 'palmaris'],
            mfuSegments: ['CA', 'DI']
        },
        {
            id: 'grp_thigh',
            name: '大腿区 (Thigh)',
            region: '大腿肌群',
            description: '覆盖股四头肌、缝匠肌、内收肌群、股二头肌与半腱肌，整合大腿前后内外侧穴位。',
            modelKeywords: ['sartorius', 'rectus femoris', 'vastus', 'adductor', 'gracilis', 'biceps femoris', 'semitendinosus', 'semimembranosus'],
            mfuSegments: ['CX', 'GE']
        },
        {
            id: 'grp_lower_leg_foot',
            name: '小腿足区 (Lower Leg & Foot)',
            region: '小腿足部肌群',
            description: '覆盖胫骨前肌、胫骨后肌、腓肠肌、比目鱼肌、腓骨肌与足背足底小肌群，对应小腿和足部穴位。',
            modelKeywords: ['tibialis', 'gastrocnemius', 'soleus', 'fibularis', 'peroneus', 'extensor digitorum', 'flexor hallucis', 'flexor digitorum'],
            mfuSegments: ['TA', 'PE']
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
        "acu_an_cp1": {
            id: "acu_an_cp1",
            mfu: "AN-CP1",
            name: "AN-CP1",
            meridian: "",
            cc: "眼窝下缘，眼轮匝肌下方纤维上，瞳孔正下方",
            treatment: {
                patient: "仰卧",
                therapist: "位于患者头侧，一手固定头部，一手治疗A) 指关节B) 指尖"
            },
            notes: "扶股贷"
        },
        "acu_an_cp2": {
            id: "acu_an_cp2",
            mfu: "AN-CP2",
            name: "AN-CP2",
            meridian: "",
            cc: "眼窝下缘下方，小颧骨肌上，朝向颧骨下缘",
            treatment: {
                patient: "仰卧",
                therapist: "位于患者头侧，一手固定头部，一手治疗A) 指关节B) 指腹"
            },
            notes: ""
        },
        "acu_an_cp3": {
            id: "acu_an_cp3",
            mfu: "AN-CP3",
            name: "AN-CP3",
            meridian: "",
            cc: "下颌，二腹肌前1/3上，下颌舌骨肌上",
            treatment: {
                patient: "仰卧",
                therapist: "位于患者头侧，一手固定头部，一手治疗A) 指关节B) 指腹"
            },
            notes: ""
        },
        "acu_an_cl": {
            id: "acu_an_cl",
            mfu: "AN-CL",
            name: "AN-CL",
            meridian: "",
            cc: "胸锁乳突肌前侧缘，平 甲状软骨水平",
            treatment: {
                patient: "仰卧",
                therapist: "位于患者头侧，一手固定头部，一手治疗 A) 指关节 B) 指腹"
            },
            notes: "往对侧 → 连线中点"
        },
        "acu_an_th": {
            id: "acu_an_th",
            mfu: "AN-TH",
            name: "AN-TH",
            meridian: "",
            cc: "剑突旁开两厘米，在腹直肌和胸大肌结合处，肋骨面上整个区域去寻找",
            treatment: {
                patient: "仰卧",
                therapist: "位于治疗点同侧，使用指关节"
            },
            notes: ""
        },
        "acu_an_lu": {
            id: "acu_an_lu",
            mfu: "AN-LU",
            name: "AN-LU",
            meridian: "",
            cc: "肚脐水平，腹直肌上",
            treatment: {
                patient: "仰卧",
                therapist: "位于治疗点同侧，使用肘关节"
            },
            notes: ""
        },
        "acu_an_pv": {
            id: "acu_an_pv",
            mfu: "AN-PV",
            name: "AN-PV",
            meridian: "",
            cc: "髂前上棘内下侧，髂窝里，髂肌上；找到髂前上棘，用肘尖垂直于腹股沟韧带方向贴着髂窝压着髂肌寻找",
            treatment: {
                patient: "仰卧，治疗侧腿微曲",
                therapist: "另一只手稳定患者膝盖，A)位于治疗点同侧，使用肘关节B)位于治疗点对侧，使用肘关节"
            },
            notes: ""
        },
        "acu_an_cx": {
            id: "acu_an_cx",
            mfu: "AN-CX",
            name: "AN-CX",
            meridian: "",
            cc: "大腿近端1/3段前侧，缝匠肌内侧，腰大肌筋膜上",
            treatment: {
                patient: "仰卧",
                therapist: "A)位于治疗点同侧，使用肘关节B)位于治疗点对侧，使用肘关节"
            },
            notes: "男性—把握放内施"
        },
        "acu_an_ge": {
            id: "acu_an_ge",
            mfu: "AN-GE",
            name: "AN-GE",
            meridian: "",
            cc: "大腿中段1/3内，股直肌外侧缘",
            treatment: {
                patient: "仰卧",
                therapist: "位于治疗点同侧，使用肘关节"
            },
            notes: "腿内施"
        },
        "acu_an_ta": {
            id: "acu_an_ta",
            mfu: "AN-TA",
            name: "AN-TA",
            meridian: "",
            cc: "胫骨前肌肌腹上，小腿 中段1/3内",
            treatment: {
                patient: "仰卧",
                therapist: "位于治疗点同侧，使用 肘关节"
            },
            notes: ""
        },
        "acu_an_pe": {
            id: "acu_an_pe",
            mfu: "AN-PE",
            name: "AN-PE",
            meridian: "",
            cc: "第一、二趾骨之间，拇短伸肌筋膜上",
            treatment: {
                patient: "仰卧",
                therapist: "位于治疗点同侧，使用指关节"
            },
            notes: "triangle 屈膝"
        },
        "acu_an_sc": {
            id: "acu_an_sc",
            mfu: "AN-SC",
            name: "AN-SC",
            meridian: "",
            cc: "喙突下方，胸小肌肌腹上，三角肌与胸大肌之间",
            treatment: {
                patient: "仰卧",
                therapist: "位于治疗点同侧A) 指关节B) 指腹"
            },
            notes: ""
        },
        "acu_an_hu": {
            id: "acu_an_hu",
            mfu: "AN-HU",
            name: "AN-HU",
            meridian: "",
            cc: "肱二头肌长头和短头之间对应的三角肌前束筋膜上",
            treatment: {
                patient: "仰卧",
                therapist: "位于治疗点同侧A)肘关节B)指关节"
            },
            notes: "①把手月由横放在肚子"
        },
        "acu_an_cu": {
            id: "acu_an_cu",
            mfu: "AN-CU",
            name: "AN-CU",
            meridian: "",
            cc: "平三角肌止点水平，肱二头肌肌腹上",
            treatment: {
                patient: "仰卧",
                therapist: "位于治疗点同侧A)肘关节B)指关节：一手稳定患者上臂，一手治疗"
            },
            notes: "①手在风展后"
        },
        "acu_an_ca": {
            id: "acu_an_ca",
            mfu: "AN-CA",
            name: "AN-CA",
            meridian: "",
            cc: "肱桡肌和桡侧腕屈肌间沟内，前臂近端1/3处",
            treatment: {
                patient: "仰卧",
                therapist: "位于治疗点同侧A) 指关节B) 肘关节"
            },
            notes: ""
        },
        "acu_re_cp1": {
            id: "acu_re_cp1",
            mfu: "RE-CP1",
            name: "RE-CP1",
            meridian: "",
            cc: "眉毛内侧1/3，眼眶外，眶上孔之上",
            treatment: {
                patient: "仰卧",
                therapist: "位于患者头侧， 使用指关节，一手稳定患者头部，一手治疗"
            },
            notes: ""
        },
        "acu_re_cp2": {
            id: "acu_re_cp2",
            mfu: "RE-CP2",
            name: "RE-CP2",
            meridian: "",
            cc: "RE-CP1上方稍外侧，近发际线，额肌上",
            treatment: {
                patient: "仰卧",
                therapist: "位于患者头侧，使用指关节，一手稳定患者头部，一手治疗"
            },
            notes: "眉头与发际线中间"
        },
        "acu_re_cp3": {
            id: "acu_re_cp3",
            mfu: "RE-CP3",
            name: "RE-CP3",
            meridian: "",
            cc: "枕骨粗隆上，竖脊肌在枕骨上的起点",
            treatment: {
                patient: "坐位，双手放额头下",
                therapist: "位于治疗点同侧，一手稳定患者头部，一手治疗，使用指关节"
            },
            notes: "(探究连线抬头找隆起竖直肌)"
        },
        "acu_re_cl": {
            id: "acu_re_cl",
            mfu: "RE-CL",
            name: "RE-CL",
            meridian: "",
            cc: "C5-6水平，斜方肌下，抵于竖脊肌边缘",
            treatment: {
                patient: "坐位，双手放额头下",
                therapist: "位于治疗点同侧，使用指关节"
            },
            notes: "上余子行日以维内顶"
        },
        "acu_re_th": {
            id: "acu_re_th",
            mfu: "RE-TH",
            name: "RE-TH",
            meridian: "",
            cc: "竖脊肌上，T4-6水平",
            treatment: {
                patient: "俯卧，手臂自然置于体侧",
                therapist: "位于治疗点同侧A)肘关节B)指关节"
            },
            notes: ""
        },
        "acu_re_lu": {
            id: "acu_re_lu",
            mfu: "RE-LU",
            name: "RE-LU",
            meridian: "",
            cc: "竖脊肌上，T12-L1水平",
            treatment: {
                patient: "俯卧，手臂放松",
                therapist: "位于治疗点同侧A)肘关节B)指关节"
            },
            notes: ""
        },
        "acu_re_pv": {
            id: "acu_re_pv",
            mfu: "RE-PV",
            name: "RE-PV",
            meridian: "",
            cc: "L4-5棘突与髂后上棘之间，抵于髂棘",
            treatment: {
                patient: "俯卧",
                therapist: "位于治疗点同侧A)肘关节B)指关节"
            },
            notes: ""
        },
        "acu_re_cx": {
            id: "acu_re_cx",
            mfu: "RE-CX",
            name: "RE-CX",
            meridian: "",
            cc: "坐骨结节和髂后上棘中点稍下，骶结节韧带上",
            treatment: {
                patient: "A)侧卧，上方腿屈曲，下方腿自然伸直；B)俯卧",
                therapist: "A)位于患者身后，使用肘关节，另一只手稳定患者身体B)位于治疗点同侧，使用肘关节"
            },
            notes: ""
        },
        "acu_re_ge": {
            id: "acu_re_ge",
            mfu: "RE-GE",
            name: "RE-GE",
            meridian: "",
            cc: "大腿后侧中段1/3内，股二头肌与半腱肌之间，抵于股二头肌长头",
            treatment: {
                patient: "俯卧",
                therapist: "位于治疗点同侧或对侧，使用肘关节"
            },
            notes: "垂直 rightarrow 往外顶"
        },
        "acu_re_ta": {
            id: "acu_re_ta",
            mfu: "RE-TA",
            name: "RE-TA",
            meridian: "",
            cc: "小腿中段1/3内， 腓肠 肌外侧靠近肌腱处",
            treatment: {
                patient: "俯卧",
                therapist: "位于治疗点 同侧 ，使用肘关节"
            },
            notes: "膝盖窝向上"
        },
        "acu_re_pe": {
            id: "acu_re_pe",
            mfu: "RE-PE",
            name: "RE-PE",
            meridian: "",
            cc: "第五跖骨基 底部周围",
            treatment: {
                patient: "足部外侧朝上",
                therapist: "A)指关节B)肘关节"
            },
            notes: "第五题有句"
        },
        "acu_re_sc": {
            id: "acu_re_sc",
            mfu: "RE-SC",
            name: "RE-SC",
            meridian: "",
            cc: "小菱形肌上，肩胛冈内侧与C7的中点，平T2",
            treatment: {
                patient: "A)坐位，同侧手做“思想者”姿势B)坐位，上身直立",
                therapist: "位于患者身后A)肘关节，另一只手稳定患者肩膀B)指关节，另一只手稳定患者肩膀"
            },
            notes: "肩胛骨"
        },
        "acu_re_hu": {
            id: "acu_re_hu",
            mfu: "RE-HU",
            name: "RE-HU",
            meridian: "",
            cc: "冈下肌肌腹，肩胛冈中点下方 冈隔筋",
            treatment: {
                patient: "A)俯卧，双臂自然放松 B)坐位，对侧手做“思想者”姿势",
                therapist: "A)位于患者头侧，用指关节 B)位于患者身后，用指关节，另一只手稳定患者肩膀"
            },
            notes: "手放侧边"
        },
        "acu_re_cu": {
            id: "acu_re_cu",
            mfu: "RE-CU",
            name: "RE-CU",
            meridian: "",
            cc: "平三角肌止点， 肱三头 肌外侧头肌腹上",
            treatment: {
                patient: "A)俯卧，手臂外展，上臂置于床面 B)俯卧，手臂置于体侧",
                therapist: "位于治疗点同侧 A)肘关节 B)指关节"
            },
            notes: "手册平行向下"
        },
        "acu_re_ca": {
            id: "acu_re_ca",
            mfu: "RE-CA",
            name: "RE-CA",
            meridian: "",
            cc: "前臂远端1/3处，尺侧腕伸肌与肌腱结合处，桡尺骨之间，抵于尺骨",
            treatment: {
                patient: "俯卧，手臂旋后置于体侧",
                therapist: "位于治疗点同侧A)指关节B)指腹"
            },
            notes: ""
        },
        "acu_re_di": {
            id: "acu_re_di",
            mfu: "RE-DI",
            name: "RE-DI",
            meridian: "",
            cc: "小鱼际外侧，第五掌骨中间",
            treatment: {
                patient: "俯卧，手臂置于体侧",
                therapist: "位于治疗点同侧，另一只手稳定患者手部，使用指关节"
            },
            notes: "手做体侧，握笔卷"
        },
        "acu_ir_cp1": {
            id: "acu_ir_cp1",
            mfu: "IR-CP1",
            name: "IR-CP1",
            meridian: "",
            cc: "眼眶与眼球之间，抵住 眼眶边缘寻找",
            treatment: {
                patient: "仰卧",
                therapist: "位于患者头侧，另一只 手固定患者头部"
            },
            notes: ""
        },
        "acu_ir_cp2": {
            id: "acu_ir_cp2",
            mfu: "IR-CP2",
            name: "IR-CP2",
            meridian: "",
            cc: "耳轮角前方，颞骨颧上方",
            treatment: {
                patient: "仰卧，头侧偏",
                therapist: "位于患者头侧，另一手固定患者头部A) 指关节B) 指腹"
            },
            notes: ""
        },
        "acu_ir_cp3": {
            id: "acu_ir_cp3",
            mfu: "IR-CP3",
            name: "IR-CP3",
            meridian: "",
            cc: "耳屏前下方，咬肌与耳朵之间",
            treatment: {
                patient: "仰卧，头侧偏",
                therapist: "位于患者头侧，另一只手固定患者头部A) 指关节B) 指腹"
            },
            notes: ""
        },
        "acu_ir_cl": {
            id: "acu_ir_cl",
            mfu: "IR-CL",
            name: "IR-CL",
            meridian: "",
            cc: "胸锁乳突肌远端 胸 束和锁骨束之间",
            treatment: {
                patient: "仰卧，头侧偏",
                therapist: "位于治疗点同侧 A) 指关节 B) 指腹"
            },
            notes: ""
        },
        "acu_ir_th": {
            id: "acu_ir_th",
            mfu: "IR-TH",
            name: "IR-TH",
            meridian: "",
            cc: "乳头下方，第4-5肋间肌上",
            treatment: {
                patient: "仰卧",
                therapist: "位于治疗点同侧A) 指关节B) 指腹"
            },
            notes: ""
        },
        "acu_ir_lu": {
            id: "acu_ir_lu",
            mfu: "IR-LU",
            name: "IR-LU",
            meridian: "",
            cc: "第十一肋肋尖和肋骨面，腋中线前方，腹斜肌上",
            treatment: {
                patient: "A)侧卧B)仰卧",
                therapist: "A)肘关节，面朝患者头部B)指关节"
            },
            notes: ""
        },
        "acu_ir_pv": {
            id: "acu_ir_pv",
            mfu: "IR-PV",
            name: "IR-PV",
            meridian: "",
            cc: "臀小肌上，大转子与髂棘之间，阔筋膜张肌后方",
            treatment: {
                patient: "侧卧，上方腿自然伸直，下方腿屈曲",
                therapist: "位于患者身后，使用肘关节，另一只手固定患者身体"
            },
            notes: ""
        },
        "acu_ir_cx": {
            id: "acu_ir_cx",
            mfu: "IR-CX",
            name: "IR-CX",
            meridian: "",
            cc: "大腿近端1/3处前侧， 缝匠肌 内侧",
            treatment: {
                patient: "A)仰卧B)侧卧，下方腿屈曲，上方腿自然伸直",
                therapist: "A)位于治疗点对侧，使用肘关节B)面朝患者，使用肘关节"
            },
            notes: ""
        },
        "acu_ir_ge": {
            id: "acu_ir_ge",
            mfu: "IR-GE",
            name: "IR-GE",
            meridian: "",
            cc: "大腿中段和远段1/3交界处，股内侧肌上，缝匠肌外侧",
            treatment: {
                patient: "A)仰卧B)侧卧，下方腿屈曲，上方腿自然伸直",
                therapist: "A)位于治疗点对侧，使用肘关节B)面朝患者足部，使用肘关节"
            },
            notes: ""
        },
        "acu_ir_ta": {
            id: "acu_ir_ta",
            mfu: "IR-TA",
            name: "IR-TA",
            meridian: "",
            cc: "小腿中段1/3内，胫骨和腓肠肌内侧之间，比目鱼肌、趾长屈肌和胫骨后肌筋膜上",
            treatment: {
                patient: "仰卧，小腿内侧朝上",
                therapist: "位于治疗点同侧A)指关节B)肘关节"
            },
            notes: ""
        },
        "acu_ir_pe": {
            id: "acu_ir_pe",
            mfu: "IR-PE",
            name: "IR-PE",
            meridian: "",
            cc: "第一跖骨基底部，踇内收肌上",
            treatment: {
                patient: "仰卧",
                therapist: "A) 指关节 B) 肘关节"
            },
            notes: ""
        },
        "acu_ir_sc": {
            id: "acu_ir_sc",
            mfu: "IR-SC",
            name: "IR-SC",
            meridian: "",
            cc: "锁骨下肌内1/3处",
            treatment: {
                patient: "A)仰卧 B)坐位",
                therapist: "位于治疗点同侧 A)指关节 B)指关节，另一只手固定肩膀"
            },
            notes: ""
        },
        "acu_ir_hu": {
            id: "acu_ir_hu",
            mfu: "IR-HU",
            name: "IR-HU",
            meridian: "",
            cc: "喙肱肌上，胸大肌 肌腱 下，上臂内侧",
            treatment: {
                patient: "仰卧",
                therapist: "位于治疗点同侧，另一只手固定患者手臂A) 指关节B) 指腹"
            },
            notes: ""
        },
        "acu_ir_cu": {
            id: "acu_ir_cu",
            mfu: "IR-CU",
            name: "IR-CU",
            meridian: "",
            cc: "前臂近端1/3内，旋前圆肌上",
            treatment: {
                patient: "仰卧",
                therapist: "位于治疗点同侧A) 指关节B) 指腹"
            },
            notes: ""
        },
        "acu_ir_ca": {
            id: "acu_ir_ca",
            mfu: "IR-CA",
            name: "IR-CA",
            meridian: "",
            cc: "前臂中段1/3内，中线偏桡侧，掌长肌和桡侧腕屈肌之间",
            treatment: {
                patient: "仰卧",
                therapist: "位于治疗点同侧A) 指关节B) 肘关节"
            },
            notes: ""
        },
        "acu_ir_di": {
            id: "acu_ir_di",
            mfu: "IR-DI",
            name: "IR-DI",
            meridian: "",
            cc: "掌心，第2/3/4骨间肌",
            treatment: {
                patient: "手心朝上",
                therapist: "位于治疗点同侧 A) 指关节 B) 肘关节"
            },
            notes: ""
        },
        "acu_er_cp1": {
            id: "acu_er_cp1",
            mfu: "ER-CP1",
            name: "ER-CP1",
            meridian: "",
            cc: "下眼眶与眼球之间，抵住眼眶边缘寻找",
            treatment: {
                patient: "仰卧",
                therapist: "位于患者头侧，使用指关节"
            },
            notes: ""
        },
        "acu_er_cp2": {
            id: "acu_er_cp2",
            mfu: "ER-CP2",
            name: "ER-CP2",
            meridian: "",
            cc: "耳朵正上方，颞肌上",
            treatment: {
                patient: "仰卧，头侧偏",
                therapist: "位于患者头侧，使用指关节"
            },
            notes: ""
        },
        "acu_er_cp3": {
            id: "acu_er_cp3",
            mfu: "ER-CP3",
            name: "ER-CP3",
            meridian: "",
            cc: "乳突后方，胸锁乳突肌在枕骨上止点",
            treatment: {
                patient: "A)坐位，双手置于前额下 B)侧卧",
                therapist: "A)使用指关节，位于患者身后，另一只手固定患者头部 B)指关节，另一只手一手固定患者头部"
            },
            notes: ""
        },
        "acu_er_cl": {
            id: "acu_er_cl",
            mfu: "ER-CL",
            name: "ER-CL",
            meridian: "",
            cc: "胸锁乳突肌后侧，C2-4横突，肩胛提肌和头夹肌上",
            treatment: {
                patient: "仰卧，头侧偏",
                therapist: "A) 指关节B) 指腹"
            },
            notes: ""
        },
        "acu_er_th": {
            id: "acu_er_th",
            mfu: "ER-TH",
            name: "ER-TH",
            meridian: "",
            cc: "后上锯肌平T3水平，抵于竖脊肌外侧",
            treatment: {
                patient: "A)俯卧，脸朝下 B)俯卧，头侧偏",
                therapist: "A)肘关节 B)指关节"
            },
            notes: ""
        },
        "acu_er_lu": {
            id: "acu_er_lu",
            mfu: "ER-LU",
            name: "ER-LU",
            meridian: "",
            cc: "第十二肋肋尖，腹内斜肌上，肋骨缘",
            treatment: {
                patient: "A)侧卧，上方手臂置于头顶B)俯卧，双臂自然放松",
                therapist: "A)位于患者身后，面朝患者头部，使用肘关节B)位于治疗点同侧，使用指关节"
            },
            notes: ""
        },
        "acu_er_pv": {
            id: "acu_er_pv",
            mfu: "ER-PV",
            name: "ER-PV",
            meridian: "",
            cc: "骷棘最高点下方，臀中肌上",
            treatment: {
                patient: "A)侧卧，上方腿自然伸直，下方腿屈曲B)俯卧",
                therapist: "A)位于患者身后，用肘关节，另一只手稳定患者身体B)位于治疗点同侧，使用指腹"
            },
            notes: ""
        },
        "acu_er_cx": {
            id: "acu_er_cx",
            mfu: "ER-CX",
            name: "ER-CX",
            meridian: "",
            cc: "大转子与骶骨连线外1/3处，梨状肌上",
            treatment: {
                patient: "A)侧卧，上方腿弯曲，膝盖置于床面，下方腿伸直B)俯卧，治疗侧腿屈曲",
                therapist: "A)肘关节，位于患者身后，面朝患者头部B)肘关节，位于治疗点同侧，面朝患者尾端"
            },
            notes: ""
        },
        "acu_er_ge": {
            id: "acu_er_ge",
            mfu: "ER-GE",
            name: "ER-GE",
            meridian: "",
            cc: "大腿远段和中段1/3交界处，股二头肌短头，髂胫束后方",
            treatment: {
                patient: "A)侧卧，上方腿屈曲，膝盖置于床面B)俯卧，治疗侧腿屈曲",
                therapist: "A)位于治疗点同侧，使用肘关节B)位于治疗点对侧，使用肘关节"
            },
            notes: ""
        },
        "acu_er_ta": {
            id: "acu_er_ta",
            mfu: "ER-TA",
            name: "ER-TA",
            meridian: "",
            cc: "小腿中段1/3内稍上， 腓骨后侧",
            treatment: {
                patient: "俯卧或侧卧",
                therapist: "A)位于治疗点同侧，使 用肘关节 B)位于治疗点对侧，使 用肘关节"
            },
            notes: "_____"
        },
        "acu_er_pe": {
            id: "acu_er_pe",
            mfu: "ER-PE",
            name: "ER-PE",
            meridian: "",
            cc: "趾短伸肌上",
            treatment: {
                patient: "足部踩在床面上",
                therapist: "指关节"
            },
            notes: ""
        },
        "acu_er_sc": {
            id: "acu_er_sc",
            mfu: "ER-SC",
            name: "ER-SC",
            meridian: "",
            cc: "棘上窝内侧，斜方肌上部外侧，肩胛提肌肌腹",
            treatment: {
                patient: "A)坐位，上身直立B)坐位，对侧手“思想者”姿势",
                therapist: "治疗点同侧，肘关节，另一只手稳定肩膀"
            },
            notes: ""
        },
        "acu_er_hu": {
            id: "acu_er_hu",
            mfu: "ER-HU",
            name: "ER-HU",
            meridian: "",
            cc: "肱骨头水平，三角肌后 束",
            treatment: {
                patient: "A)侧卧，手臂置于体前 B)自然坐位",
                therapist: "A)肘关节 B)指关节，一手稳定肩 膀，一手治疗"
            },
            notes: ""
        },
        "acu_er_cu": {
            id: "acu_er_cu",
            mfu: "ER-CU",
            name: "ER-CU",
            meridian: "",
            cc: "肱三头肌肌腱外侧缘，上臂远端1/3内",
            treatment: {
                patient: "俯卧，双臂置于体侧",
                therapist: "位于治疗点同侧A)指关节B)肘关节"
            },
            notes: ""
        },
        "acu_er_ca": {
            id: "acu_er_ca",
            mfu: "ER-CA",
            name: "ER-CA",
            meridian: "",
            cc: "前臂中段1/3内，拇长伸肌和指伸肌之间",
            treatment: {
                patient: "俯卧",
                therapist: "位于治疗点同侧，使用指关节"
            },
            notes: ""
        },
        "acu_er_di": {
            id: "acu_er_di",
            mfu: "ER-DI",
            name: "ER-DI",
            meridian: "",
            cc: "第2/3/4骨间肌背侧",
            treatment: {
                patient: "手掌朝下置于治疗床",
                therapist: "指关节"
            },
            notes: "_____"
        },
        "acu_la_cp1": {
            id: "acu_la_cp1",
            mfu: "LA-CP1",
            name: "LA-CP1",
            meridian: "",
            cc: "外眼角外侧，眼轮匝肌外侧纤维上",
            treatment: {
                patient: "仰卧，头侧偏",
                therapist: "A)指关节B)指腹"
            },
            notes: ""
        },
        "acu_la_cp2": {
            id: "acu_la_cp2",
            mfu: "LA-CP2",
            name: "LA-CP2",
            meridian: "",
            cc: "颞肌上，约与咬肌对齐的位置",
            treatment: {
                patient: "仰卧，头侧偏",
                therapist: "指关节，另一只手固定患者头部"
            },
            notes: ""
        },
        "acu_la_cp3": {
            id: "acu_la_cp3",
            mfu: "LA-CP3",
            name: "LA-CP3",
            meridian: "",
            cc: "咬肌肌腹上",
            treatment: {
                patient: "仰卧，头侧偏",
                therapist: "使用指关节，另一只手 固定患者头部"
            },
            notes: ""
        },
        "acu_la_cl": {
            id: "acu_la_cl",
            mfu: "LA-CL",
            name: "LA-CL",
            meridian: "",
            cc: "胸锁乳突肌胸骨束与锁骨束汇合处，平甲状软骨水平",
            treatment: {
                patient: "仰卧，头侧偏",
                therapist: "使用指关节，另一只手固定头部"
            },
            notes: ""
        },
        "acu_la_th": {
            id: "acu_la_th",
            mfu: "LA-TH",
            name: "LA-TH",
            meridian: "",
            cc: "肩胛骨下角之下，竖脊肌与斜方肌外面，T8-9水平的胸髂肋肌上",
            treatment: {
                patient: "俯卧",
                therapist: "位于治疗点同侧A)指关节B)肘关节"
            },
            notes: "平面接触—很"
        },
        "acu_la_lu": {
            id: "acu_la_lu",
            mfu: "LA-LU",
            name: "LA-LU",
            meridian: "",
            cc: "助缘和髂棘之间的区域 腰方肌外侧缘",
            treatment: {
                patient: "A) 侧卧，上方手臂置于 头顶 B) 俯卧",
                therapist: "A) 位于患者身后，使用 肘关节 B) 位于治疗点同侧，使 用肘关节"
            },
            notes: ""
        },
        "acu_la_pv": {
            id: "acu_la_pv",
            mfu: "LA-PV",
            name: "LA-PV",
            meridian: "",
            cc: "大转子和髂后上棘的中点，臀大肌和臀中肌间沟，第二骶孔水平",
            treatment: {
                patient: "A)侧卧，上方腿伸直，下方腿弯曲B)侧卧",
                therapist: "A)位于患者身后，使用肘关节B)位于治疗点同侧，使用肘关节"
            },
            notes: ""
        },
        "acu_la_cx": {
            id: "acu_la_cx",
            mfu: "LA-CX",
            name: "LA-CX",
            meridian: "",
            cc: "阔筋膜张肌肌腹上，平大转子",
            treatment: {
                patient: "A)侧卧，双腿并拢微曲 B)仰卧，治疗侧腿屈曲",
                therapist: "A)位于患者身前，使用肘关节 B)位于治疗点同侧，使用指关节"
            },
            notes: ""
        },
        "acu_la_ge": {
            id: "acu_la_ge",
            mfu: "LA-GE",
            name: "LA-GE",
            meridian: "",
            cc: "大腿外侧中间， 髂胫束上",
            treatment: {
                patient: "A)俯卧，治疗腿弯曲 B)侧卧，双腿并拢弯曲",
                therapist: "A)位于治疗点同侧，肘关节 B)位于患者身前，肘关节"
            },
            notes: ""
        },
        "acu_la_ta": {
            id: "acu_la_ta",
            mfu: "LA-TA",
            name: "LA-TA",
            meridian: "",
            cc: "小腿中段1/3内靠上，腓骨上或稍前",
            treatment: {
                patient: "俯卧，治疗腿弯曲",
                therapist: "位于治疗点同侧 A)肘关节 B)指关节"
            },
            notes: ""
        },
        "acu_la_pe": {
            id: "acu_la_pe",
            mfu: "LA-PE",
            name: "LA-PE",
            meridian: "",
            cc: "第2/3骨间肌背侧",
            treatment: {
                patient: "足部踩在床面上",
                therapist: "指关节"
            },
            notes: "_____"
        },
        "acu_la_sc": {
            id: "acu_la_sc",
            mfu: "LA-SC",
            name: "LA-SC",
            meridian: "",
            cc: "斜方肌前面，朝向斜角肌和颈基底部，胸锁乳突肌和斜方肌之间",
            treatment: {
                patient: "A)仰卧，头侧偏B)坐位",
                therapist: "A)位于治疗点同侧，指关节B)位于患者身后，指关节"
            },
            notes: ""
        },
        "acu_la_hu": {
            id: "acu_la_hu",
            mfu: "LA-HU",
            name: "LA-HU",
            meridian: "",
            cc: "三角肌前束与中束的肌间隔，肱骨头水平",
            treatment: {
                patient: "A)仰卧B)侧卧",
                therapist: "A)位于治疗点同侧，指关节，另一手固定肩膀B)位于患者身前，肘关节，另一只手固定肩膀"
            },
            notes: ""
        },
        "acu_la_cu": {
            id: "acu_la_cu",
            mfu: "LA-CU",
            name: "LA-CU",
            meridian: "",
            cc: "上臂远端1/3内，外侧 肌间隔上，肱桡肌止点",
            treatment: {
                patient: "仰卧",
                therapist: "位于治疗点同侧 A)一手固定患者手臂，另一只手治疗，使用指 关节 B)使用肘关节"
            },
            notes: ""
        },
        "acu_la_ca": {
            id: "acu_la_ca",
            mfu: "LA-CA",
            name: "LA-CA",
            meridian: "",
            cc: "前臂近端 1/3内 ，肱桡肌外侧缘，桡侧伸肌间沟内",
            treatment: {
                patient: "俯卧，前臂置于头侧",
                therapist: "位于治疗点同侧，一手固定患者手臂，使用指关节"
            },
            notes: ""
        },
        "acu_la_di": {
            id: "acu_la_di",
            mfu: "LA-DI",
            name: "LA-DI",
            meridian: "",
            cc: "第1骨间肌背侧",
            treatment: {
                patient: "手背朝上",
                therapist: "位于治疗点同侧，使用 指关节"
            },
            notes: ""
        },
        "acu_me_cp1": {
            id: "acu_me_cp1",
            mfu: "ME-CP1",
            name: "ME-CP1",
            meridian: "",
            cc: "内眼角内侧，抵于鼻骨",
            treatment: {
                patient: "仰卧",
                therapist: "位于治疗点同侧 A) 指关节 B) 指尖"
            },
            notes: ""
        },
        "acu_me_cp2_a": {
            id: "acu_me_cp2_a",
            mfu: "ME-CP2 a",
            name: "ME-CP2 a",
            meridian: "",
            cc: "唇中锋或人中上",
            treatment: {
                patient: "仰卧",
                therapist: "使用指腹"
            },
            notes: ""
        },
        "acu_me_cp2_r": {
            id: "acu_me_cp2_r",
            mfu: "ME-CP2 r",
            name: "ME-CP2 r",
            meridian: "",
            cc: "前额上部发际线处，颅骨中线",
            treatment: {
                patient: "仰卧",
                therapist: "使用指关节或指腹"
            },
            notes: ""
        },
        "acu_me_cp3_a": {
            id: "acu_me_cp3_a",
            mfu: "ME-CP3 a",
            name: "ME-CP3 a",
            meridian: "",
            cc: "下巴中点",
            treatment: {
                patient: "仰卧",
                therapist: "使用指关节或指腹"
            },
            notes: ""
        },
        "acu_me_cp3_r": {
            id: "acu_me_cp3_r",
            mfu: "ME-CP3 r",
            name: "ME-CP3 r",
            meridian: "",
            cc: "枕骨粗隆下，项韧带起点",
            treatment: {
                patient: "A)坐位，双手置于额头 下B)俯卧",
                therapist: "一手稳定患者头部，使 用"
            },
            notes: ""
        },
        "acu_me_cl_r": {
            id: "acu_me_cl_r",
            mfu: "ME-CL r",
            name: "ME-CL r",
            meridian: "",
            cc: "颈段棘上韧带全部触诊，找到致密点",
            treatment: {
                patient: "坐位，双手置于额头下",
                therapist: "一手固定患者头部，另一只手治疗A) 指关节B) 指腹"
            },
            notes: ""
        },
        "acu_me_cl": {
            id: "acu_me_cl",
            mfu: "ME-CL",
            name: "ME-CL",
            meridian: "",
            cc: "胸骨上切迹",
            treatment: {
                patient: "仰卧",
                therapist: "A) 指关节 B) 指腹"
            },
            notes: ""
        },
        "acu_me_th": {
            id: "acu_me_th",
            mfu: "ME-TH",
            name: "ME-TH",
            meridian: "",
            cc: "整个胸骨上，触诊寻找致密点",
            treatment: {
                patient: "仰卧",
                therapist: "A) 指关节 B) 指腹"
            },
            notes: ""
        },
        "acu_me_th_r": {
            id: "acu_me_th_r",
            mfu: "ME-TH r",
            name: "ME-TH r",
            meridian: "",
            cc: "胸段棘上韧带全部触诊，找到致密点",
            treatment: {
                patient: "俯卧",
                therapist: "A) 指关节 B) 指腹"
            },
            notes: ""
        },
        "acu_me_lu": {
            id: "acu_me_lu",
            mfu: "ME-LU",
            name: "ME-LU",
            meridian: "",
            cc: "腹白线全部触诊，找致 密点",
            treatment: {
                patient: "仰卧",
                therapist: "肘关节"
            },
            notes: ""
        },
        "acu_me_lu_r": {
            id: "acu_me_lu_r",
            mfu: "ME-LU r",
            name: "ME-LU r",
            meridian: "",
            cc: "腰段棘上韧带全部触诊，找到致密点",
            treatment: {
                patient: "俯卧",
                therapist: "肘关节"
            },
            notes: ""
        },
        "acu_me_pv": {
            id: "acu_me_pv",
            mfu: "ME-PV",
            name: "ME-PV",
            meridian: "",
            cc: "肚脐到耻骨联合之间区域全部触诊，找到致密点",
            treatment: {
                patient: "仰卧",
                therapist: "肘关节"
            },
            notes: ""
        },
        "acu_me_pv_r": {
            id: "acu_me_pv_r",
            mfu: "ME-PV r",
            name: "ME-PV r",
            meridian: "",
            cc: "骶骨和尾骨之间，中线上",
            treatment: {
                patient: "俯卧",
                therapist: "A)肘关节 B)指关节"
            },
            notes: ""
        },
        "acu_me_cx": {
            id: "acu_me_cx",
            mfu: "ME-CX",
            name: "ME-CX",
            meridian: "",
            cc: "大腿内侧近端1/3处，股薄肌上",
            treatment: {
                patient: "侧卧，治疗腿在下自然伸直，上侧腿弯曲",
                therapist: "位于患者身后A)肘关节B)指关节"
            },
            notes: ""
        },
        "acu_me_ge": {
            id: "acu_me_ge",
            mfu: "ME-GE",
            name: "ME-GE",
            meridian: "",
            cc: "大腿内侧远端1/3交界处，股薄肌上",
            treatment: {
                patient: "侧卧，治疗腿在下自然伸直，上侧腿弯曲",
                therapist: "位于患者身后A)肘关节B)指关节"
            },
            notes: ""
        },
        "acu_me_ta": {
            id: "acu_me_ta",
            mfu: "ME-TA",
            name: "ME-TA",
            meridian: "",
            cc: "小腿中段1/3，腓肠肌内侧接近肌腱处",
            treatment: {
                patient: "俯卧",
                therapist: "位于治疗点同侧，使用肘关节"
            },
            notes: ""
        },
        "acu_me_pe": {
            id: "acu_me_pe",
            mfu: "ME-PE",
            name: "ME-PE",
            meridian: "",
            cc: "跟骨与足舟骨之间，踇长屈肌和胫骨后肌腱膜",
            treatment: {
                patient: "仰卧，足内侧向上",
                therapist: "A) 指关节 B) 肘关节"
            },
            notes: ""
        },
        "acu_me_sc": {
            id: "acu_me_sc",
            mfu: "ME-SC",
            name: "ME-SC",
            meridian: "",
            cc: "第三肋间隙，胸大肌在肋骨上止点 均与肱肌",
            treatment: {
                patient: "仰卧",
                therapist: "指关节"
            },
            notes: "轻一点"
        },
        "acu_me_hu": {
            id: "acu_me_hu",
            mfu: "ME-HU",
            name: "ME-HU",
            meridian: "",
            cc: "上臂上1/3与中1/3交界处，内侧肌间隔上",
            treatment: {
                patient: "仰卧",
                therapist: "一手固定患者手臂，一手治疗，指关节"
            },
            notes: ""
        },
        "acu_me_cu": {
            id: "acu_me_cu",
            mfu: "ME-CU",
            name: "ME-CU",
            meridian: "",
            cc: "上臂远端1/3与中段1/3交界处，内侧肌间隔上治疗",
            treatment: {
                patient: "仰卧",
                therapist: "一手固定患者手臂，一手治疗，指关节"
            },
            notes: ""
        },
        "acu_me_ca": {
            id: "acu_me_ca",
            mfu: "ME-CA",
            name: "ME-CA",
            meridian: "",
            cc: "前臂远端1/3与中段1/3交界处，尺侧腕屈肌肌肉肌腱结合处",
            treatment: {
                patient: "A)俯卧，前臂旋前B)仰卧，前臂旋后",
                therapist: "一手固定患者手臂，一手治疗，指关节"
            },
            notes: ""
        },
        "acu_me_di": {
            id: "acu_me_di",
            mfu: "ME-DI",
            name: "ME-DI",
            meridian: "",
            cc: "小鱼际肌腹上",
            treatment: {
                patient: "掌心朝上",
                therapist: "一手固定患者手掌，一手治疗，指关节"
            },
            notes: ""
        }
    }
};
