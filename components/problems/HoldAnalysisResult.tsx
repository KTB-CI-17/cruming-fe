import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Platform, Dimensions, LayoutChangeEvent } from 'react-native';
import { GestureHandlerRootView, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Props, ImageInfo } from '@/api/types/hold-types';
import { AnalysisResponse } from "@/api/types/holds";

const createDummyData = (imageUri: string): AnalysisResponse => ({
    "image_path": imageUri,
    "detections": [
        {
            "class": "Hold",
            "confidence": 0.8868032693862915,
            "coordinates": {
                "x1": 776.8053588867188,
                "y1": 206.60739135742188,
                "x2": 873.8600463867188,
                "y2": 292.187255859375
            }
        },
        {
            "class": "Hold",
            "confidence": 0.883637547492981,
            "coordinates": {
                "x1": 876.1849365234375,
                "y1": 134.21563720703125,
                "x2": 961.373046875,
                "y2": 227.39370727539062
            }
        },
        {
            "class": "Hold",
            "confidence": 0.8728872537612915,
            "coordinates": {
                "x1": 966.2175903320312,
                "y1": 73.8055191040039,
                "x2": 1087.330322265625,
                "y2": 186.51486206054688
            }
        },
        {
            "class": "Hold",
            "confidence": 0.8616166710853577,
            "coordinates": {
                "x1": 965.4916381835938,
                "y1": 432.59771728515625,
                "x2": 1124.303955078125,
                "y2": 599.1409912109375
            }
        },
        {
            "class": "Hold",
            "confidence": 0.8538775444030762,
            "coordinates": {
                "x1": 960.015869140625,
                "y1": 190.71315002441406,
                "x2": 1127.236328125,
                "y2": 266.1957702636719
            }
        },
        {
            "class": "Hold",
            "confidence": 0.849680483341217,
            "coordinates": {
                "x1": 837.1802978515625,
                "y1": 380.9538269042969,
                "x2": 954.0657958984375,
                "y2": 498.0185546875
            }
        },
        {
            "class": "Hold",
            "confidence": 0.8434922695159912,
            "coordinates": {
                "x1": 365.3517761230469,
                "y1": 184.37770080566406,
                "x2": 426.090087890625,
                "y2": 241.4014434814453
            }
        },
        {
            "class": "Hold",
            "confidence": 0.8380902409553528,
            "coordinates": {
                "x1": 880.5321044921875,
                "y1": 80.94834899902344,
                "x2": 966.3411865234375,
                "y2": 131.4360809326172
            }
        },
        {
            "class": "Hold",
            "confidence": 0.825080931186676,
            "coordinates": {
                "x1": 741.6181640625,
                "y1": 332.6087646484375,
                "x2": 842.2240600585938,
                "y2": 422.85821533203125
            }
        },
        {
            "class": "Hold",
            "confidence": 0.8225035071372986,
            "coordinates": {
                "x1": 363.041748046875,
                "y1": 416.0791931152344,
                "x2": 400.50372314453125,
                "y2": 463.18475341796875
            }
        },
        {
            "class": "Hold",
            "confidence": 0.8152426481246948,
            "coordinates": {
                "x1": 841.9854125976562,
                "y1": 267.9757385253906,
                "x2": 935.4788208007812,
                "y2": 363.7368469238281
            }
        },
        {
            "class": "Hold",
            "confidence": 0.8106579184532166,
            "coordinates": {
                "x1": 465.68548583984375,
                "y1": 127.91065979003906,
                "x2": 533.5263671875,
                "y2": 169.4221649169922
            }
        },
        {
            "class": "Hold",
            "confidence": 0.8081871867179871,
            "coordinates": {
                "x1": 1097.4879150390625,
                "y1": 103.0335922241211,
                "x2": 1146.8433837890625,
                "y2": 135.80348205566406
            }
        },
        {
            "class": "Hold",
            "confidence": 0.8081464767456055,
            "coordinates": {
                "x1": 846.7271118164062,
                "y1": 193.0087432861328,
                "x2": 881.4044189453125,
                "y2": 221.84603881835938
            }
        },
        {
            "class": "Hold",
            "confidence": 0.8064897656440735,
            "coordinates": {
                "x1": 801.063232421875,
                "y1": 164.92713928222656,
                "x2": 836.8741455078125,
                "y2": 193.23997497558594
            }
        },
        {
            "class": "Hold",
            "confidence": 0.8039715886116028,
            "coordinates": {
                "x1": 358.9682312011719,
                "y1": 372.5318603515625,
                "x2": 392.87774658203125,
                "y2": 403.9877014160156
            }
        },
        {
            "class": "Hold",
            "confidence": 0.8026992082595825,
            "coordinates": {
                "x1": 403.7747802734375,
                "y1": 412.79559326171875,
                "x2": 453.855712890625,
                "y2": 466.24249267578125
            }
        },
        {
            "class": "Hold",
            "confidence": 0.8007149696350098,
            "coordinates": {
                "x1": 936.24072265625,
                "y1": 233.75343322753906,
                "x2": 1090.4364013671875,
                "y2": 373.9886474609375
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7948857545852661,
            "coordinates": {
                "x1": 848.8914794921875,
                "y1": 550.1463623046875,
                "x2": 921.38671875,
                "y2": 606.148681640625
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7937622666358948,
            "coordinates": {
                "x1": 1078.6151123046875,
                "y1": 63.52241516113281,
                "x2": 1112.6807861328125,
                "y2": 93.26455688476562
            }
        },
        {
            "class": "Hold",
            "confidence": 0.791688084602356,
            "coordinates": {
                "x1": 386.0665283203125,
                "y1": 124.02539825439453,
                "x2": 431.3311767578125,
                "y2": 151.00999450683594
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7914943695068359,
            "coordinates": {
                "x1": 1055.233154296875,
                "y1": 280.7606506347656,
                "x2": 1100.634521484375,
                "y2": 316.1029357910156
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7889055013656616,
            "coordinates": {
                "x1": 455.3138732910156,
                "y1": 194.53065490722656,
                "x2": 523.3980102539062,
                "y2": 245.3827667236328
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7869873046875,
            "coordinates": {
                "x1": 606.5478515625,
                "y1": 153.12550354003906,
                "x2": 746.5468139648438,
                "y2": 347.2756042480469
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7809131145477295,
            "coordinates": {
                "x1": 570.1515502929688,
                "y1": 144.11614990234375,
                "x2": 599.0870971679688,
                "y2": 169.18756103515625
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7793679237365723,
            "coordinates": {
                "x1": 422.4259948730469,
                "y1": 185.15415954589844,
                "x2": 451.6697082519531,
                "y2": 209.51266479492188
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7779205441474915,
            "coordinates": {
                "x1": 938.9008178710938,
                "y1": 124.88221740722656,
                "x2": 981.3692626953125,
                "y2": 148.743896484375
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7685179710388184,
            "coordinates": {
                "x1": 915.001220703125,
                "y1": 339.625244140625,
                "x2": 972.3681640625,
                "y2": 376.2903747558594
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7673751711845398,
            "coordinates": {
                "x1": 364.7893371582031,
                "y1": 341.92596435546875,
                "x2": 402.2147521972656,
                "y2": 371.0946044921875
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7646993398666382,
            "coordinates": {
                "x1": 220.4600067138672,
                "y1": 205.89752197265625,
                "x2": 258.6372985839844,
                "y2": 242.40133666992188
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7639939188957214,
            "coordinates": {
                "x1": 1079.4466552734375,
                "y1": 312.51043701171875,
                "x2": 1118.5279541015625,
                "y2": 354.825439453125
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7630006074905396,
            "coordinates": {
                "x1": 907.9207763671875,
                "y1": 21.06378746032715,
                "x2": 1033.746826171875,
                "y2": 84.0728988647461
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7628089189529419,
            "coordinates": {
                "x1": 924.1472778320312,
                "y1": 301.7862243652344,
                "x2": 965.280517578125,
                "y2": 338.76251220703125
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7537925839424133,
            "coordinates": {
                "x1": 834.1952514648438,
                "y1": 128.18467712402344,
                "x2": 870.3836059570312,
                "y2": 158.68267822265625
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7516533732414246,
            "coordinates": {
                "x1": 976.985595703125,
                "y1": 71.1393051147461,
                "x2": 1015.2296752929688,
                "y2": 97.98719787597656
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7487376928329468,
            "coordinates": {
                "x1": 906.3016967773438,
                "y1": 396.9624938964844,
                "x2": 957.0218505859375,
                "y2": 437.8649597167969
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7482414245605469,
            "coordinates": {
                "x1": 852.406005859375,
                "y1": 101.01947021484375,
                "x2": 877.6026000976562,
                "y2": 120.29183197021484
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7369117736816406,
            "coordinates": {
                "x1": 668.2517700195312,
                "y1": 346.2034606933594,
                "x2": 695.8219604492188,
                "y2": 372.3635559082031
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7360696792602539,
            "coordinates": {
                "x1": 363.7450866699219,
                "y1": 152.69073486328125,
                "x2": 391.5740966796875,
                "y2": 175.1886749267578
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7211353778839111,
            "coordinates": {
                "x1": 401.1195373535156,
                "y1": 162.99806213378906,
                "x2": 422.4739074707031,
                "y2": 185.47360229492188
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7173780202865601,
            "coordinates": {
                "x1": 379.2579040527344,
                "y1": 251.80201721191406,
                "x2": 406.9939270019531,
                "y2": 276.53076171875
            }
        },
        {
            "class": "Hold",
            "confidence": 0.713272750377655,
            "coordinates": {
                "x1": 452.8270263671875,
                "y1": 282.5701904296875,
                "x2": 476.4187927246094,
                "y2": 304.186767578125
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7115137577056885,
            "coordinates": {
                "x1": 830.4271850585938,
                "y1": 489.8079833984375,
                "x2": 863.9171752929688,
                "y2": 519.055908203125
            }
        },
        {
            "class": "Hold",
            "confidence": 0.7106726169586182,
            "coordinates": {
                "x1": 808.3043212890625,
                "y1": 430.70782470703125,
                "x2": 857.7920532226562,
                "y2": 473.1851501464844
            }
        },
        {
            "class": "Hold",
            "confidence": 0.6913518905639648,
            "coordinates": {
                "x1": 1042.9803466796875,
                "y1": 389.82269287109375,
                "x2": 1069.28955078125,
                "y2": 410.58074951171875
            }
        },
        {
            "class": "Hold",
            "confidence": 0.6882124543190002,
            "coordinates": {
                "x1": 510.0908203125,
                "y1": 392.80218505859375,
                "x2": 536.0460205078125,
                "y2": 416.6905822753906
            }
        },
        {
            "class": "Hold",
            "confidence": 0.6878719329833984,
            "coordinates": {
                "x1": 404.4781799316406,
                "y1": 268.23382568359375,
                "x2": 454.25335693359375,
                "y2": 327.1343994140625
            }
        },
        {
            "class": "Hold",
            "confidence": 0.6867209076881409,
            "coordinates": {
                "x1": 1067.38525390625,
                "y1": 451.43011474609375,
                "x2": 1093.576171875,
                "y2": 472.501953125
            }
        },
        {
            "class": "Hold",
            "confidence": 0.6864895224571228,
            "coordinates": {
                "x1": 415.4340515136719,
                "y1": 497.5072937011719,
                "x2": 434.54461669921875,
                "y2": 521.5759887695312
            }
        },
        {
            "class": "Hold",
            "confidence": 0.685278594493866,
            "coordinates": {
                "x1": 568.7034301757812,
                "y1": 199.3224639892578,
                "x2": 599.939697265625,
                "y2": 225.53575134277344
            }
        },
        {
            "class": "Hold",
            "confidence": 0.675646960735321,
            "coordinates": {
                "x1": 1145.4384765625,
                "y1": 367.61322021484375,
                "x2": 1179,
                "y2": 395.1314392089844
            }
        },
        {
            "class": "Hold",
            "confidence": 0.6733843088150024,
            "coordinates": {
                "x1": 811.3352661132812,
                "y1": 292.74481201171875,
                "x2": 840.8583984375,
                "y2": 316.3735046386719
            }
        },
        {
            "class": "Hold",
            "confidence": 0.6605157256126404,
            "coordinates": {
                "x1": 265.0387878417969,
                "y1": 184.256591796875,
                "x2": 317.2766418457031,
                "y2": 246.4602508544922
            }
        },
        {
            "class": "Hold",
            "confidence": 0.6559600234031677,
            "coordinates": {
                "x1": 770.8695678710938,
                "y1": 303.6686706542969,
                "x2": 798.0657958984375,
                "y2": 327.6619567871094
            }
        },
        {
            "class": "Hold",
            "confidence": 0.646909236907959,
            "coordinates": {
                "x1": 538.549560546875,
                "y1": 366.209716796875,
                "x2": 560.56884765625,
                "y2": 391.11474609375
            }
        },
        {
            "class": "Hold",
            "confidence": 0.6301003694534302,
            "coordinates": {
                "x1": 449.06219482421875,
                "y1": 326.83404541015625,
                "x2": 570.296630859375,
                "y2": 372.4720458984375
            }
        },
        {
            "class": "Hold",
            "confidence": 0.6268951296806335,
            "coordinates": {
                "x1": 1022.2974853515625,
                "y1": 0,
                "x2": 1050.3853759765625,
                "y2": 16.32744598388672
            }
        },
        {
            "class": "Hold",
            "confidence": 0.6082707047462463,
            "coordinates": {
                "x1": 475.4710998535156,
                "y1": 416.05450439453125,
                "x2": 491.0167236328125,
                "y2": 434.03948974609375
            }
        },
        {
            "class": "Hold",
            "confidence": 0.605374276638031,
            "coordinates": {
                "x1": 486.37628173828125,
                "y1": 246.24899291992188,
                "x2": 641.1256713867188,
                "y2": 393.8677062988281
            }
        },
        {
            "class": "Hold",
            "confidence": 0.5823791027069092,
            "coordinates": {
                "x1": 843.1284790039062,
                "y1": 585.3798217773438,
                "x2": 870.746337890625,
                "y2": 605.3369750976562
            }
        },
        {
            "class": "Hold",
            "confidence": 0.5801617503166199,
            "coordinates": {
                "x1": 289.1869201660156,
                "y1": 245.78158569335938,
                "x2": 315.3956298828125,
                "y2": 271.025390625
            }
        },
        {
            "class": "Hold",
            "confidence": 0.5791513323783875,
            "coordinates": {
                "x1": 951.6133422851562,
                "y1": 389.7752685546875,
                "x2": 973.7703247070312,
                "y2": 412.14739990234375
            }
        },
        {
            "class": "Hold",
            "confidence": 0.5622922778129578,
            "coordinates": {
                "x1": 484.38555908203125,
                "y1": 489.0635681152344,
                "x2": 632.2024536132812,
                "y2": 542.1931762695312
            }
        },
        {
            "class": "Hold",
            "confidence": 0.56182861328125,
            "coordinates": {
                "x1": 586.5536499023438,
                "y1": 168.58663940429688,
                "x2": 607.7041015625,
                "y2": 191.1813507080078
            }
        },
        {
            "class": "Hold",
            "confidence": 0.5613009333610535,
            "coordinates": {
                "x1": 398.4943542480469,
                "y1": 325.5645751953125,
                "x2": 470.8053894042969,
                "y2": 413.0538024902344
            }
        },
        {
            "class": "Hold",
            "confidence": 0.5569796562194824,
            "coordinates": {
                "x1": 311.83978271484375,
                "y1": 420.1136169433594,
                "x2": 332.6510009765625,
                "y2": 456.5174255371094
            }
        },
        {
            "class": "Hold",
            "confidence": 0.5472670197486877,
            "coordinates": {
                "x1": 313.5632629394531,
                "y1": 311.0696716308594,
                "x2": 338.4674377441406,
                "y2": 377.04046630859375
            }
        },
        {
            "class": "Hold",
            "confidence": 0.5431012511253357,
            "coordinates": {
                "x1": 957.5360107421875,
                "y1": 504.2739562988281,
                "x2": 983.8251953125,
                "y2": 524.7173461914062
            }
        },
        {
            "class": "Hold",
            "confidence": 0.541985034942627,
            "coordinates": {
                "x1": 416.0553894042969,
                "y1": 252.84841918945312,
                "x2": 430.0980224609375,
                "y2": 266.1219787597656
            }
        },
        {
            "class": "Hold",
            "confidence": 0.5388290286064148,
            "coordinates": {
                "x1": 474.1997985839844,
                "y1": 441.4292297363281,
                "x2": 628.2012939453125,
                "y2": 531.4644165039062
            }
        },
        {
            "class": "Hold",
            "confidence": 0.49926188588142395,
            "coordinates": {
                "x1": 523.8118896484375,
                "y1": 180.76756286621094,
                "x2": 571.727783203125,
                "y2": 244.26907348632812
            }
        },
        {
            "class": "Hold",
            "confidence": 0.49290671944618225,
            "coordinates": {
                "x1": 571.1547241210938,
                "y1": 402.8706359863281,
                "x2": 589.32373046875,
                "y2": 418.1385498046875
            }
        },
        {
            "class": "Hold",
            "confidence": 0.481273353099823,
            "coordinates": {
                "x1": 390.57196044921875,
                "y1": 462.60406494140625,
                "x2": 408.0245666503906,
                "y2": 478.51275634765625
            }
        },
        {
            "class": "Hold",
            "confidence": 0.4650726318359375,
            "coordinates": {
                "x1": 630.2999877929688,
                "y1": 66.91943359375,
                "x2": 653.382080078125,
                "y2": 87.26642608642578
            }
        },
        {
            "class": "Hold",
            "confidence": 0.4614395201206207,
            "coordinates": {
                "x1": 262.887451171875,
                "y1": 324.44757080078125,
                "x2": 281.1321105957031,
                "y2": 350.9518737792969
            }
        },
        {
            "class": "Hold",
            "confidence": 0.45760151743888855,
            "coordinates": {
                "x1": 437.71343994140625,
                "y1": 103.21065521240234,
                "x2": 457.78021240234375,
                "y2": 122.13819885253906
            }
        },
        {
            "class": "Hold",
            "confidence": 0.4523245394229889,
            "coordinates": {
                "x1": 790.6870727539062,
                "y1": 316.60784912109375,
                "x2": 819.0739135742188,
                "y2": 345.7005920410156
            }
        },
        {
            "class": "Hold",
            "confidence": 0.4509945213794708,
            "coordinates": {
                "x1": 251.93124389648438,
                "y1": 280.27587890625,
                "x2": 268.97821044921875,
                "y2": 299.269287109375
            }
        },
        {
            "class": "Hold",
            "confidence": 0.43513384461402893,
            "coordinates": {
                "x1": 297.531494140625,
                "y1": 353.7890625,
                "x2": 322.18939208984375,
                "y2": 392.9984436035156
            }
        },
        {
            "class": "Hold",
            "confidence": 0.4138050079345703,
            "coordinates": {
                "x1": 289.5226745605469,
                "y1": 400.728759765625,
                "x2": 309.1609802246094,
                "y2": 441.9261474609375
            }
        },
        {
            "class": "Hold",
            "confidence": 0.40091177821159363,
            "coordinates": {
                "x1": 222.44029235839844,
                "y1": 159.10960388183594,
                "x2": 257.1489562988281,
                "y2": 210.9424591064453
            }
        },
        {
            "class": "Hold",
            "confidence": 0.40006011724472046,
            "coordinates": {
                "x1": 267.3706970214844,
                "y1": 285.7614440917969,
                "x2": 288.297119140625,
                "y2": 313.68731689453125
            }
        },
        {
            "class": "Hold",
            "confidence": 0.39211469888687134,
            "coordinates": {
                "x1": 238.36257934570312,
                "y1": 268.95623779296875,
                "x2": 248.33148193359375,
                "y2": 283.015625
            }
        },
        {
            "class": "Hold",
            "confidence": 0.3886266052722931,
            "coordinates": {
                "x1": 285.8360595703125,
                "y1": 308.7923583984375,
                "x2": 313.08038330078125,
                "y2": 346.0198669433594
            }
        },
        {
            "class": "Hold",
            "confidence": 0.38814136385917664,
            "coordinates": {
                "x1": 253.09222412109375,
                "y1": 336.66351318359375,
                "x2": 269.3299255371094,
                "y2": 353.8767395019531
            }
        },
        {
            "class": "Hold",
            "confidence": 0.374244749546051,
            "coordinates": {
                "x1": 265.5060119628906,
                "y1": 363.8433532714844,
                "x2": 284.2119140625,
                "y2": 383.0050354003906
            }
        },
        {
            "class": "Hold",
            "confidence": 0.37406831979751587,
            "coordinates": {
                "x1": 309.4730529785156,
                "y1": 323.30303955078125,
                "x2": 333.7606201171875,
                "y2": 375.3374328613281
            }
        },
        {
            "class": "Hold",
            "confidence": 0.37292221188545227,
            "coordinates": {
                "x1": 411.9380187988281,
                "y1": 326.1627502441406,
                "x2": 478.7928771972656,
                "y2": 399.1198425292969
            }
        },
        {
            "class": "Hold",
            "confidence": 0.3670772910118103,
            "coordinates": {
                "x1": 237.2574005126953,
                "y1": 297.72991943359375,
                "x2": 260.166259765625,
                "y2": 326.3167724609375
            }
        },
        {
            "class": "Hold",
            "confidence": 0.3658135235309601,
            "coordinates": {
                "x1": 1164.1715087890625,
                "y1": 96.21607208251953,
                "x2": 1179,
                "y2": 129.75750732421875
            }
        },
        {
            "class": "Hold",
            "confidence": 0.35421112179756165,
            "coordinates": {
                "x1": 517.933349609375,
                "y1": 262.6495666503906,
                "x2": 535.5175170898438,
                "y2": 277.8594970703125
            }
        },
        {
            "class": "Hold",
            "confidence": 0.35100674629211426,
            "coordinates": {
                "x1": 315.2759094238281,
                "y1": 455.36541748046875,
                "x2": 337.787109375,
                "y2": 495.1932678222656
            }
        },
        {
            "class": "Hold",
            "confidence": 0.34335118532180786,
            "coordinates": {
                "x1": 250.85972595214844,
                "y1": 246.9581756591797,
                "x2": 268.01513671875,
                "y2": 265.54254150390625
            }
        },
        {
            "class": "Hold",
            "confidence": 0.33860477805137634,
            "coordinates": {
                "x1": 1144.0513916015625,
                "y1": 190.35379028320312,
                "x2": 1179,
                "y2": 353.21429443359375
            }
        },
        {
            "class": "Hold",
            "confidence": 0.3267725110054016,
            "coordinates": {
                "x1": 319.0223083496094,
                "y1": 504.4716796875,
                "x2": 338.4881591796875,
                "y2": 551.2361450195312
            }
        },
        {
            "class": "Hold",
            "confidence": 0.3254527449607849,
            "coordinates": {
                "x1": 457.37164306640625,
                "y1": 239.64234924316406,
                "x2": 491.4244079589844,
                "y2": 261.0136413574219
            }
        },
        {
            "class": "Hold",
            "confidence": 0.305064857006073,
            "coordinates": {
                "x1": 279.262451171875,
                "y1": 375.4156494140625,
                "x2": 298.0973205566406,
                "y2": 404.2151184082031
            }
        },
        {
            "class": "Hold",
            "confidence": 0.29314130544662476,
            "coordinates": {
                "x1": 843.195556640625,
                "y1": 268.4165344238281,
                "x2": 935.8222045898438,
                "y2": 325.7447204589844
            }
        },
        {
            "class": "Hold",
            "confidence": 0.26485931873321533,
            "coordinates": {
                "x1": 472.1483154296875,
                "y1": 221.08119201660156,
                "x2": 522.0180053710938,
                "y2": 247.78567504882812
            }
        },
        {
            "class": "Hold",
            "confidence": 0.2626818120479584,
            "coordinates": {
                "x1": 528.23193359375,
                "y1": 280.385498046875,
                "x2": 546.2593994140625,
                "y2": 301.3592834472656
            }
        },
        {
            "class": "Hold",
            "confidence": 0.2623710334300995,
            "coordinates": {
                "x1": 437.3787536621094,
                "y1": 530.1654663085938,
                "x2": 584.1844482421875,
                "y2": 580.0482177734375
            }
        },
        {
            "class": "Hold",
            "confidence": 0.25712427496910095,
            "coordinates": {
                "x1": 266.284423828125,
                "y1": 352.9956359863281,
                "x2": 281.8623352050781,
                "y2": 366.3902282714844
            }
        },
        {
            "class": "Hold",
            "confidence": 0.2547476589679718,
            "coordinates": {
                "x1": 332.00897216796875,
                "y1": 479.49395751953125,
                "x2": 347.1360778808594,
                "y2": 502.4467468261719
            }
        },
        {
            "class": "Hold",
            "confidence": 0.252084344625473,
            "coordinates": {
                "x1": 288.0300598144531,
                "y1": 435.12603759765625,
                "x2": 317.206298828125,
                "y2": 513.6402587890625
            }
        }
    ]

});

export default function HoldAnalysisResult({ imageUri }: Props) {
    const [selectedHolds, setSelectedHolds] = useState<number[]>([]);
    const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
    const [layoutInfo, setLayoutInfo] = useState<{ width: number; height: number } | null>(null);

    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const dummyData = createDummyData(imageUri);
    const screenWidth = Dimensions.get('window').width;

    // 애니메이션 스타일
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    // 이미지 크기 계산
    useEffect(() => {
        if (!layoutInfo) return;

        Image.getSize(
            imageUri,
            (originalWidth, originalHeight) => {
                const containerWidth = layoutInfo.width;
                const containerHeight = layoutInfo.height;
                const imageRatio = originalWidth / originalHeight;
                const containerRatio = containerWidth / containerHeight;

                let displayWidth, displayHeight, offsetX, offsetY;

                if (imageRatio > containerRatio) {
                    displayWidth = containerWidth;
                    displayHeight = containerWidth / imageRatio;
                    offsetX = 0;
                    offsetY = (containerHeight - displayHeight) / 2;
                } else {
                    displayHeight = containerHeight;
                    displayWidth = containerHeight * imageRatio;
                    offsetX = (containerWidth - displayWidth) / 2;
                    offsetY = 0;
                }

                setImageInfo({
                    originalWidth,
                    originalHeight,
                    displayWidth,
                    displayHeight,
                    offsetX,
                    offsetY
                });
            },
            error => console.error('Error loading image:', error)
        );
    }, [layoutInfo, imageUri]);

    const calculateScaledCoordinates = (coordinates: any) => {
        if (!imageInfo) return { left: 0, top: 0, width: 0, height: 0 };

        const { originalWidth, originalHeight, displayWidth, displayHeight, offsetX, offsetY } = imageInfo;
        const scaleX = displayWidth / originalWidth;
        const scaleY = displayHeight / originalHeight;

        return {
            left: coordinates.x1 * scaleX + offsetX,
            top: coordinates.y1 * scaleY + offsetY,
            width: (coordinates.x2 - coordinates.x1) * scaleX,
            height: (coordinates.y2 - coordinates.y1) * scaleY,
        };
    };

    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        setLayoutInfo({ width, height });
    };

    const onPinchEvent = ({ nativeEvent }: any) => {
        scale.value = Math.max(1, Math.min(5, nativeEvent.scale));
        translateX.value = nativeEvent.focalX;
        translateY.value = nativeEvent.focalY;
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.imageContainer} onLayout={onLayout}>
                <PinchGestureHandler onGestureEvent={onPinchEvent}>
                    <Animated.View style={[styles.animatedContainer, animatedStyle]}>
                        <Image
                            source={{ uri: imageUri }}
                            style={[
                                styles.image,
                                imageInfo && {
                                    width: imageInfo.displayWidth,
                                    height: imageInfo.displayHeight,
                                    marginLeft: imageInfo.offsetX,
                                    marginTop: imageInfo.offsetY,
                                }
                            ]}
                            resizeMode="contain"
                        />
                        {imageInfo && dummyData.detections.map((detection, index) => {
                            const scaledCoords = calculateScaledCoordinates(detection.coordinates);
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.holdButton,
                                        {
                                            left: scaledCoords.left,
                                            top: scaledCoords.top,
                                            width: scaledCoords.width,
                                            height: scaledCoords.height,
                                        },
                                        selectedHolds.includes(index) && styles.selectedHold,
                                    ]}
                                    onPress={() => setSelectedHolds(prev =>
                                        prev.includes(index)
                                            ? prev.filter(i => i !== index)
                                            : [...prev, index]
                                    )}
                                    activeOpacity={0.7}
                                />
                            );
                        })}
                    </Animated.View>
                </PinchGestureHandler>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    animatedContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        position: 'absolute',
        ...Platform.select({
            ios: {
                zIndex: 1,
            },
            android: {
                elevation: 1,
            },
        }),
    },
    holdButton: {
        position: 'absolute',
        borderWidth: 2,
        borderColor: 'transparent',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        ...Platform.select({
            ios: {
                zIndex: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    selectedHold: {
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
    },
});
