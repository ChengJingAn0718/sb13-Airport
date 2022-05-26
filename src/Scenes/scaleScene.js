import React, { useEffect, useRef, useContext, useState } from 'react';
import "../stylesheets/styles.css";
import BaseImage from '../components/BaseImage';
import { UserContext } from '../components/BaseShot';
import { prePathUrl, setExtraVolume } from "../components/CommonFunctions";

let currentMaskNum = 0;
const Scene = React.forwardRef(({ nextFunc, _baseGeo, loadFunc, bgLoaded, _startTransition }, ref) => {

    const audioList = useContext(UserContext)

    const baseObject = useRef();
    const blackWhiteObject = useRef();
    const colorObject = useRef();
    const currentImage = useRef()
    const airOutLine = useRef()

    const [isSceneLoad, setSceneLoad] = useState(false)


    const maskPathList = [
        'guard_checking_man_mask',
        'scaner_machine_mask',
        'staf_mask',
        'display_board_mask',
        'excelater_mask',
        'man_sat_on_chair_mask',
        'pilot_and_air_hostess_mask',
        'pilot_mask',
        'teamarket',
        'two_boys_mask',
        'runway_mask',
        'airoplane_mask_takeoff'
    ]

    const maskTransformList = [
        { x: 0.60, y: -0.38, s: 2.2 },
        { x: 0.53, y: -0.42, s: 3 },
        { x: 0.25, y: -0.35, s: 3 },
        { x: -0.1, y: 0.7, s: 3.5 },
        { x: 0.5, y: 0.3, s: 2 },
        { x: -0.3, y: 0.05, s: 3.5 },
        { x: -0.62, y: -0.15, s: 3 },
        { x: -0.62, y: -0.2, s: 3.5 },
        { x: -0.75, y: 0.3, s: 2.5 },
        { x: -1.15, y: 0.24, s: 3.5 },
        { x: 0.05, y: 0.1, s: 2 },
        { x: 0.6, y: 0.98, s: 3 }
    ]

    const leftMarginList = [
        0.19, 0.36, 0.415, 0.525, 0.23, 0.55, 0.65, 0.61, 0.78, 0.699, 0.63, 0.367
    ]

    const topMarginList = [
        0.65, 0.65, 0.63, 0.4, 0.3, 0.49, 0.54, 0.55, 0.42, 0.431, 0.44, 0.3
    ]

    function showIndividualImage() {
        baseObject.current.style.transition = '1s'

        if (currentMaskNum == 11) {
            setTimeout(() => {
                airOutLine.current.setClass('show')
            }, 1000);
        }

        baseObject.current.style.transform =
            'translate(' + maskTransformList[currentMaskNum].x * 100 + '%,' + maskTransformList[currentMaskNum].y * 100 + '%) ' +
            'scale(' + maskTransformList[currentMaskNum].s + ') '

        setTimeout(() => {
            blackWhiteObject.current.className = 'show'
            colorObject.current.className = 'hide'
        }, 1000);

        setTimeout(() => {
            currentImage.current.style.transform =
                "translate(" + _baseGeo.width * maskTransformList[currentMaskNum].s * (0.02 -
                    0.04 * leftMarginList[currentMaskNum]) / 2 + "px,"
                + _baseGeo.height * maskTransformList[currentMaskNum].s * (0.02
                    - 0.04 * topMarginList[currentMaskNum]) / 2 + "px)"
                + "scale(1.04) "


            if (currentMaskNum == 11) {
                airOutLine.current.setStyle([
                    {
                        key: 'transform',
                        value: "translate(" + _baseGeo.width * 0.007 + "px,"
                            + _baseGeo.height * 0.008 + "px)"
                            + "scale(1.0395) "
                    }
                ])
            }

            let timeDuration = audioList.bodyAudio1.duration * 1000
            audioList.bodyAudio1.play().catch(error => { });

            if (currentMaskNum + 2 == 6) {
                timeDuration += audioList.bodyAudio2.duration * 1000
                setTimeout(() => {
                    audioList.bodyAudio2.play();
                }, audioList.bodyAudio1.duration * 1000);
            }

            setTimeout(() => {
                if (currentMaskNum < 11) {
                    if (currentMaskNum + 3 == 6) {
                        audioList.bodyAudio2.src = prePathUrl() + "sounds/intro/intro" + (currentMaskNum + 3) + "_2.mp3"
                        audioList.bodyAudio1.src = prePathUrl() + "sounds/intro/intro" + (currentMaskNum + 3) + "_1.mp3"
                    }
                    else {
                        audioList.bodyAudio1.src = prePathUrl() + "sounds/intro/intro" + (currentMaskNum + 3) + ".mp3"
                    }
                }
                setTimeout(() => {
                    currentImage.current.style.transform = "scale(1)"
                    if (currentMaskNum == 11)
                        airOutLine.current.setStyle([{ key: 'transform', value: 'scale(1)' }])


                    setTimeout(() => {
                        colorObject.current.className = 'show'
                        airOutLine.current.setClass('hide')
                    }, 300);

                    setTimeout(() => {
                        if (currentMaskNum == maskPathList.length - 1) {
                            setTimeout(() => {
                                _startTransition(3)
                                setTimeout(() => {
                                    audioList.wooAudio.play().catch(error => { });
                                    nextFunc()
                                }, 300);
                            }, 2000);
                        }
                        else {
                            currentMaskNum++;
                            blackWhiteObject.current.style.WebkitMaskImage = 'url("' + prePathUrl() + 'images/intro/' + maskPathList[currentMaskNum] + '.png")'
                            blackWhiteObject.current.className = 'hide'
                            setTimeout(() => {
                                showIndividualImage()
                            }, 2000);
                        }
                    }, 500);
                }, 2000);
            }, timeDuration);
        }, 2000);
    }
    useEffect(() => {



        return () => {
            currentMaskNum = 0;
        }

    }, [])

    React.useImperativeHandle(ref, () => ({
        sceneLoad: () => {
            setSceneLoad(true)
        },
        sceneStart: () => {

            loadFunc()

            baseObject.current.className = 'aniObject'
            audioList.bodyAudio1.src = prePathUrl() + 'sounds/intro/intro2.mp3';
            audioList.bodyAudio2.src = prePathUrl() + 'sounds/intro/intro1.mp3';



            blackWhiteObject.current.style.transition = "0.5s"
            currentImage.current.style.transition = '0.5s'
            airOutLine.current.setStyle([{ key: 'transition', value: '0.5s' }])

            setTimeout(() => {
                audioList.bodyAudio2.play().catch(error => { })
                setTimeout(() => {
                    showIndividualImage()
                }, audioList.bodyAudio2.duration * 1000 + 2000);
            }, 3000);
        },
        sceneEnd: () => {
            currentMaskNum = 0;
            setSceneLoad(false)
        }
    }))

    return (
        <div>
            {
                isSceneLoad &&
                <div ref={baseObject}
                    className='hideObject'
                    style={{
                        position: "fixed", width: _baseGeo.width + "px"
                        , height: _baseGeo.height + "px",
                        left: _baseGeo.left + 'px',
                        top: _baseGeo.top + 'px',
                    }}
                >
                    <div
                        style={{
                            position: "absolute", width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%'
                        }} >
                        <img
                            width={'100%'}
                            style={{
                                position: 'absolute',
                                left: '0%',
                                top: '0%',

                            }}
                            src={prePathUrl() + "images/intro/airpot_bg_black_and_white.png"}
                        />
                    </div>

                    <div
                        ref={blackWhiteObject}
                        style={{
                            position: "absolute", width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%',
                            WebkitMaskImage: 'url("' + prePathUrl() + 'images/intro/' + maskPathList[currentMaskNum] + '.png")',
                            WebkitMaskSize: '100% 100%',
                            WebkitMaskRepeat: "no-repeat"
                        }} >

                        <img
                            ref={currentImage}
                            width={'100%'}
                            style={{
                                position: 'absolute',
                                left: '0%',
                                top: '0%',
                            }}
                            src={prePathUrl() + "images/intro/airpot_bg.png"}
                        />
                        <BaseImage
                            ref={airOutLine}
                            url={'intro/intro_131.png'}
                            scale={0.684}
                            posInfo={{
                                l: 0.1335, t: 0.0995
                            }}
                            className='hideObject'
                        />
                    </div>


                    <div
                        ref={colorObject}
                        style={{
                            position: "absolute", width: '100%'
                            , height: '100%',
                            left: '0%',
                            top: '0%',
                        }} >
                        <img
                            width={'100%'}
                            style={{
                                position: 'absolute',
                                left: '0%',
                                top: '0%',
                            }}
                            onLoad={bgLoaded}
                            src={prePathUrl() + "images/intro/airpot_bg.png"}

                        />
                    </div>


                </div>
            }
        </div >
    );
});

export default Scene;
