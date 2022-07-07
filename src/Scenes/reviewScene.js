import React, { useEffect, useRef, useContext, useState } from 'react';
import "../stylesheets/styles.css";
import BaseImage from '../components/BaseImage';
import { UserContext } from '../components/BaseShot';
import { prePathUrl, setExtraVolume, setRepeatAudio, setRepeatType, startRepeatAudio, stopRepeatAudio } from "../components/CommonFunctions";

const loadCount = 7

var isRendered = false;
var isEffectPassed = false;

let imageCount = 0
let stepCount = 0;

let activeInterval
let timerList = []

let clickedList = []

const Scene = React.forwardRef(({ nextFunc, _baseGeo, _geo }, ref) => {

    const audioList = useContext(UserContext)

    const aniImageList = Array.from({ length: 10 }, ref => useRef())
    const textImageList = Array.from({ length: 10 }, ref => useRef())
    const pictureBody = useRef()

    const [isLoadLast, setLoadLast] = useState(false)

    const [isSceneLoad, setSceneLoad] = useState(false)

    const textPosList = [
        { s: 0.17, l: 0.115, t: 0.46 },
        { s: 0.2, l: 0.41, t: 0.46 },
        { s: 0.25, l: 0.7, t: 0.465 },

        { s: 0.21, l: 0.115, t: 0.77 },
        { s: 0.16, l: 0.415, t: 0.77 },
        { s: 0.21, l: 0.71, t: 0.77 },

        { s: 0.2, l: 0.14, t: 0.46 },
        { s: 0.16, l: 0.64, t: 0.46 },
        { s: 0.22, l: 0.14, t: 0.765 },
        { s: 0.27, l: 0.64, t: 0.765 },
    ]

    const baseObject = useRef()
    useEffect(() => {



        return () => {
            imageCount = 0;
            isRendered = false;
            isEffectPassed = false;

            for (let i = 0; i < 10; i++) {
                audioList[i].currentTime = 0
                audioList[i].pause();
            }

            stopRepeatAudio()

            audioList.bodyAudio0.currentTime = 0;

        }
    }, [])

    React.useImperativeHandle(ref, () => ({
        sceneLoad: () => {
            setSceneLoad(true)
        },
        sceneStart: () => {
            baseObject.current.className = 'aniObject'

            timerList[0] = setTimeout(activeBtnFunc, 1500);

            audioList.bodyAudio0.src = prePathUrl() + "sounds/word/common_review0.mp3"
            audioList.bodyAudio1.src = prePathUrl() + "sounds/word/common_review.mp3"

            setRepeatAudio(audioList.commonAudio3)
            setRepeatType(2)
            setExtraVolume(audioList.commonAudio3, 4)

            imageCount = 0;
            isEffectPassed = true;


            clickedList = []

        },
        sceneEnd: () => {
        }
    }))

    const activeBtnFunc = () => {
        if (!isRendered) {
            isRendered = true;
            baseObject.current.className = 'aniObject'
            timerList[1] = setTimeout(() => {
                audioList.bodyAudio1.play().catch(error => { });
                timerList[3] = setTimeout(() => {
                    audioList.commonAudio3.play().catch(error => { })
                    startRepeatAudio()
                }, audioList.bodyAudio1.duration * 1000 + 1000);
            }, 2000);

        }
    }

    const loadImage = () => {
        if (!isRendered) {
            imageCount++

            if (imageCount == loadCount) {
                clearTimeout(timerList[0])
                activeInterval = setInterval(() => {
                    if (isEffectPassed) {
                        activeBtnFunc();
                        clearInterval(activeInterval)
                    }
                }, 100);
            }
        }
    }



    const showWordText = (clickedNum) => {

        stopRepeatAudio()
        if (!clickedList.includes(clickedNum)) {
            timerList.map(timer => clearTimeout(timer))
            if (clickedList.length == 0) {

                audioList.bodyAudio0.pause()
                audioList.bodyAudio1.pause()

                audioList.bodyAudio0.currentTime = 0
                audioList.bodyAudio1.currentTime = 0
            }

            if (clickedList.length > 0)
                audioList[clickedList.slice(-1)].pause();

            clickedList.push(clickedNum)
            aniImageList[clickedNum].current.setStyle([{ key: 'cursor', value: 'default' }])

            aniImageList[clickedNum].current.setStyle([
                { key: 'transform', value: 'scale(0.9)' },
                { key: 'transition', value: '0.3s' }
            ])

            setTimeout(() => {
                setExtraVolume(audioList[clickedNum], 4)

                setTimeout(() => {
                    audioList[clickedNum].play().catch(error => { });
                }, 50);


                startRepeatAudio()

                aniImageList[clickedNum].current.setStyle([
                    { key: 'transform', value: 'scale(1)' },
                    { key: 'transition', value: '0.3s' }
                ])
                textImageList[clickedNum].current.setStyle([
                    { key: 'transform', value: 'translateX(0%)' },
                    { key: 'transition', value: '0.6s' },
                ])
                if (clickedNum == 2 || clickedNum == 5) {
                    pictureBody.current.style.transform = 'translateX(' + _geo.width * -0.06 + 'px)'
                    pictureBody.current.style.transition = '0.6s'
                }

                if (clickedNum == 7 || clickedNum == 9) {
                    pictureBody.current.style.transform = 'translateX(' + _geo.width * -0.05 + 'px)'
                    pictureBody.current.style.transition = '0.6s'
                }
            }, 300);


            if (clickedList.length == 3) {
                setLoadLast(true)
            }

            else if (clickedList.length == 6) {
                setTimeout(() => {
                    setTimeout(() => {
                        pictureBody.current.style.transform = 'translateX(0px)'
                        pictureBody.current.style.transition = '0.0s'
                    }, 500);
                    for (let i = 0; i < 10; i++) {
                        if (i < 6) {
                            textImageList[i].current.setClass('hide')
                            aniImageList[i].current.setClass('hide')
                        }
                        else {
                            setTimeout(() => {
                                textImageList[i].current.setClass('show')
                                aniImageList[i].current.setClass('show')
                            }, 500);
                        }
                    }
                }, 5000);
            }

            else if (clickedList.length == 10) {
                setTimeout(() => {
                    nextFunc()
                }, 5000);
            }
        }
        else
            startRepeatAudio()
    }

    const getLeftInfo = (index) => {

        let value = 0;
        if (index < 6)
            value = 0.04 + (index % 3) * 0.29
        else
            value = 0.05 + (index % 2) * 0.5
        return value
    }

    const getTopInfo = (index) => {
        let value = 0;
        if (index < 6)
            value = index < 3 ? 0.4 : 0.7
        else
            value = index < 8 ? 0.4 : 0.7
        return value


    }

    return (
        <div>

            {isSceneLoad
                &&
                <div ref={baseObject}
                    className='hideObject'
                    style={{
                        position: "fixed", width: _baseGeo.width + "px"
                        , height: _baseGeo.height + "px",
                        left: _baseGeo.left + 'px',
                        top: _baseGeo.top + 'px',
                    }}
                >
                    <BaseImage url='bg/bg_color.png' />

                    <div
                        style={{
                            position: "fixed", width: _geo.width * 0.5 + "px",
                            height: _geo.width * 0.08 + "px",
                            left: _geo.left + _geo.width * 0.32
                            , top: _geo.top + _geo.height * 0.05
                            , cursor: "pointer",
                        }}>
                        <img
                            width={"100%"}
                            draggable={false}
                            onLoad={loadImage}
                            src={prePathUrl() + 'images/words/words_title.png'}
                        />
                    </div>

                    <div
                        ref={pictureBody}
                        style={{
                            position: 'fixed', width: _geo.width + 'px',
                            height: _geo.height + 'px', left: _geo.left + _geo.width * 0.1 + 'px', top: _geo.top + 'px'
                        }}>
                        {
                            Array.from(Array(10).keys()).map((value, index) =>
                                (isLoadLast || index < 6) &&
                                <div
                                    style={{
                                        position: 'absolute',
                                         width: textPosList[index].s * 100 + '%',
                                        height: '15%', left: textPosList[index].l * 100 + '%',
                                        top: textPosList[index].t * 100 + '%',
                                        overflow: 'hidden',

                                    }}>
                                    <BaseImage
                                        ref={textImageList[index]}
                                        key={index}
                                        url={"words/" + (value + 1) + "_1.png"}
                                        style={{ transform: 'translateX(-100%)' }}
                                        className={index < 6 ? '' : 'nonDisplay'}
                                    />
                                </div>
                            )
                        }
                        {
                            Array.from(Array(10).keys()).map((value, index) =>
                                (isLoadLast || index < 6) &&
                                <BaseImage
                                    ref={aniImageList[index]}
                                    key={index}
                                    scale={0.14}
                                    posInfo={{
                                        l: getLeftInfo(index),
                                        t: getTopInfo(index)
                                    }}
                                    style={{ cursor: 'pointer' }}
                                    onLoad={index < 6 ? loadImage : null}
                                    onClick={() => { showWordText(index) }}
                                    url={"words/" + (value + 1) + "_0.png"}
                                    className={index < 6 ? '' : 'nonDisplay'}
                                />
                            )
                        }

                    </div>
                </div>
            }

        </div>
    );
});

export default Scene;
