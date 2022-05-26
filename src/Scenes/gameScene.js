import React, { useEffect, useRef, useState, useContext } from 'react';
import "../stylesheets/styles.css";
import BaseImage from '../components/BaseImage';
import { UserContext } from '../components/BaseShot';
import { setExtraVolume, setPrimaryAudio, setRepeatAudio, setRepeatType, startRepeatAudio, stopRepeatAudio } from "../components/CommonFunctions"
import { prePathUrl } from "../components/CommonFunctions";

let currentMaskNum = 0;
let timerList = []
let stepCount = 0;

const Scene = React.forwardRef(({ nextFunc, _baseGeo, _geo, loadFunc }, ref) => {


    const audioList = useContext(UserContext)

    const baseObject = useRef();
    const blackWhiteObject = useRef();
    const airPortRef = useRef();
    const buttonRefs = useRef()
    const starRefs = Array.from({ length: 7 }, ref => useRef())

    const aniImageList = Array.from({ length: 4 }, ref => useRef())


    const [isSceneLoad, setSceneLoad] = useState(false)
    const parentRef = useRef()

    useEffect(() => {



        return () => {
            stepCount = 0;
        }
    }, [])

    React.useImperativeHandle(ref, () => ({
        sceneLoad: () => {
            setSceneLoad(true)
        },
        sceneStart: () => {
            parentRef.current.className = 'aniObject'
            setRepeatAudio(audioList.commonAudio2)
            setPrimaryAudio(audioList.bodyAudio1)
            setRepeatType(1)

            currentMaskNum = 0;
            // blackWhiteObject.current.style.transition = "0.5s"
            aniImageList.map(image => {
                image.current.setClass('hideObject')
            })

            blackWhiteObject.current.className = 'hideObject'
            buttonRefs.current.className = 'hideObject'
            audioList.bodyAudio1.src = prePathUrl() + "sounds/question/question1.mp3"
            audioList.bodyAudio2.src = prePathUrl() + "sounds/question/answer1.mp3"

            setTimeout(() => {
                audioList.bodyAudio1.play().catch(error => { });
                setTimeout(() => {
                    playZoomAnimation();
                }, audioList.bodyAudio1.duration * 1000 + 3000);
            }, 3000);
        },
        sceneEnd: () => {
            setSceneLoad(false)
            stepCount = 0;

            stopRepeatAudio()
        }
    }))

    const playZoomAnimation = () => {
        let imageNum = 0;
        blackWhiteObject.current.className = 'hideMask'
        airPortRef.current.setClass('hideObject')

        aniImageList[0].current.setClass('showObject')
        let imageShowInterval = setInterval(() => {
            aniImageList[imageNum].current.setClass('hideObject')
            imageNum++
            aniImageList[imageNum].current.setClass('showobject')
            if (imageNum == 3) {
                clearInterval(imageShowInterval)
                showControlFunc()
            }
        }, 150);
    }

    const showControlFunc = () => {
        if (stepCount < 6) {
            blackWhiteObject.current.style.WebkitMaskImage = 'url("' + prePathUrl() + 'images/questions/q' + (stepCount + 2) + '/mask.png")'
            airPortRef.current.setUrl('questions/q' + (stepCount + 2) + '/q0.png');

            aniImageList.map((image, index) => {
                if (index < 3)
                    image.current.setUrl('questions/q' + (stepCount + 2) + '/q' + (index + 1) + '.png')
            })
        }

        timerList[3] = setTimeout(() => {
            audioList.commonAudio2.play()
            startRepeatAudio()
        }, 1000);

        buttonRefs.current.className = 'show'
    }

    const returnBackground = () => {
        airPortRef.current.setClass('show')
        buttonRefs.current.className = 'hide'
        aniImageList[3].current.setClass('hide')
        blackWhiteObject.current.className = 'show halfOpacity'
        setTimeout(() => {
            if (stepCount < 7)
                aniImageList[3].current.setUrl('questions/q' + (stepCount + 1) + '/q4.png')
        }, 600);

        setTimeout(() => {
            audioList.bodyAudio1.play().catch(error => { });
            setTimeout(() => {
                playZoomAnimation();
            }, audioList.bodyAudio1.duration * 1000 + 3000);
        }, 3000);
    }

    const clickAnswer = () => {
        //play answer..

        stopRepeatAudio()
        timerList.map(timer => clearTimeout(timer))

        if (stepCount < 6)
            audioList.bodyAudio1.src = prePathUrl() + "sounds/question/question" + (stepCount + 2) + ".mp3"
        audioList.bodyAudio2.play().catch(error => { });
        buttonRefs.current.style.pointerEvents = 'none'

        setTimeout(() => {
            audioList.successAudio.play().catch(error => { })
            starRefs[stepCount].current.setClass('show')
            stepCount++

            if (stepCount < 7)
                audioList.bodyAudio2.src =
                    prePathUrl() + "sounds/question/answer" + (stepCount + 1) + ".mp3"

            setTimeout(() => {
                audioList.successAudio.pause();
                audioList.successAudio.currentTime = 0;

                if (stepCount < 7) {
                    returnBackground();
                    buttonRefs.current.style.pointerEvents = ''
                }
                else {
                    setTimeout(() => {
                        nextFunc()
                    }, 2000);
                }
            }, 4000);

        }, audioList.bodyAudio2.duration * 1000);
    }
    return (
        <div>
            {
                isSceneLoad &&
                <div
                    ref={parentRef}
                    className='hideObject'>
                    <div ref={baseObject}
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
                                src={prePathUrl() + "images/bg/bg_color.png"}
                            />
                        </div>

                        {
                            Array.from(Array(7).keys()).map(value =>
                                <div
                                    style={{
                                        position: "fixed", width: _geo.width * 0.05 + "px",
                                        right: _geo.width * (value * 0.042 + 0.01) + 'px'
                                        , top: 0.02 * _geo.height + 'px'
                                        , cursor: "pointer",
                                    }}>
                                    <BaseImage
                                        url={'icon/sb13_progress_bar_gray.png'}
                                    />
                                    <BaseImage
                                        ref={starRefs[6 - value]}
                                        url={'icon/sb13_progress_bar.png'}
                                        className='hideObject'
                                    />
                                </div>)
                        }



                        <BaseImage
                            ref={airPortRef}
                            url={"questions/q1/q0.png"}
                        />

                        <div
                            ref={blackWhiteObject}
                            className="halfOpacity"
                            style={{
                                position: "absolute", width: '100%'
                                , height: '100%',
                                left: '0%',
                                top: '0%',
                                // WebkitMaskImage: 'url(prepathurl()+"images/questions/q2/mask.png")',
                                // WebkitMaskImage: 'url(prePathUrl() + "images/questions/q2/mask.png")',
                                WebkitMaskSize: '100% 100%',
                                WebkitMaskRepeat: "no-repeat",
                                background: 'black',

                            }} >

                        </div>

                        {
                            [1, 2, 3].map(value =>
                                <BaseImage
                                    ref={aniImageList[value - 1]}
                                    scale={1}
                                    posInfo={{ l: 0, t: 0 }}
                                    url={"questions/q1/q" + value + ".png"}
                                />
                            )
                        }

                        <div
                            style={{
                                position: "fixed", width: _geo.width * 1.6 + "px",
                                height: _geo.height + "px",
                                left: _geo.left - _geo.width * 0.285 + 'px'
                                , top: _geo.top - _geo.height * 0.33 + 'px'
                            }}>
                            <BaseImage
                                ref={aniImageList[3]}
                                url={"questions/q1/q4.png"}
                            />
                        </div>



                        <div ref={buttonRefs}>
                            <div
                                className='commonButton'
                                onClick={clickAnswer}
                                style={{
                                    position: "fixed", width: _geo.width * 0.1 + "px",
                                    height: _geo.width * 0.1 + "px",
                                    left: _geo.left + _geo.width * 0.45
                                    , top: _geo.top + _geo.height * 0.72
                                    , cursor: "pointer",
                                    borderRadius: '50%',
                                    overflow: 'hidden',

                                }}>
                                <img

                                    width={"370%"}
                                    style={{
                                        position: 'absolute',
                                        left: '-230%',
                                        top: '-32%'
                                    }}
                                    draggable={false}
                                    src={prePathUrl() + 'images/buttons/answer_button.svg'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
});

export default Scene;
