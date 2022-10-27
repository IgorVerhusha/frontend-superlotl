import React, { FC, useEffect, useRef, useState } from 'react';
import Slider from '@containers/HomePage/components/Slider';
import footer from 'public/assets/img/home-page/footer/footer.jpg';
import light from 'public/assets/img/home-page/faq/light.png';
import styles from './styles.module.scss';
import { ACCORDION_ITEMS } from '@constants/home-page';
import { Accordion } from '@containers/HomePage/components/Accordion';
import HomePageMain from '@containers/HomePage/modules/Main';
import BeginningHomePage from '@containers/HomePage/modules/Beginning';
import MintWaterway from '@containers/HomePage/modules/MintWaterway';
import { useWindowSize } from '@hooks/useWindowSize';


const HomePage: FC = () => {
    const [activeWaterwayTab, setActiveWaterwayTab] = useState(0);
    const beginningSection = useRef<HTMLDivElement>(null);
    const mintWaterwaySection = useRef<HTMLDivElement>(null);
    const [beginningScroll, setBeginningScroll] = useState(0);
    const [mintTranslate, setMintTranslate] = useState(0);
    const [beginningOpacity, setBeginningOpacity] = useState(0);
    const windowSize = useWindowSize();

    const handleExecuteScroll = () => {
      beginningSection?.current?.scrollIntoView(
        { behavior: 'smooth' }
      );
    };

    useEffect(() => {
      if (windowSize.width && windowSize.width < 600) return;
      const onScroll = () => {
        if (!beginningSection.current || !mintWaterwaySection.current) return;
        const mintScroll = (-1 * mintWaterwaySection.current.getBoundingClientRect().y / (mintWaterwaySection.current.clientHeight / 100));
        const begScroll = (-1 * beginningSection.current.getBoundingClientRect().y / (beginningSection.current.clientHeight / 100));
        let mintWaterwayHeight = mintWaterwaySection.current.clientHeight;
        let mintWaterwayScroll = window.pageYOffset - mintWaterwaySection.current.offsetTop;
        let num;
        mintWaterwayScroll < 3 * (mintWaterwayHeight / 6) - 300 ?
          (num = 1) :
          mintWaterwayScroll < 4 * (mintWaterwayHeight / 6) - 300 ?
            (num = 2) :
            mintWaterwayScroll < 5 * (mintWaterwayHeight / 6) - 300 ?
              (num = 3) : (num = 4);
        setActiveWaterwayTab(num);
        setBeginningScroll(begScroll);
        if (begScroll < 26) {
          setBeginningOpacity(1);
        } else if (begScroll >= 26 && begScroll <= 46) {
          const begOpacity = (46 - begScroll) / 20;
          setBeginningOpacity(begOpacity);
          if (begOpacity <= 0.05) {
            setBeginningOpacity(0);
          }
          if (begOpacity >= 0.95) {
            setBeginningOpacity(1);
          }
        } else if (begScroll > 46) {
          setBeginningOpacity(0);
        }
        if (mintScroll < 10) {
          setMintTranslate(0);
        } else if (mintScroll >= 10 && mintScroll <= 30) {
          setMintTranslate(-((mintScroll - 10) / 20) * 100);
        } else if (mintScroll > 30) {
          setMintTranslate(-100);
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }, [windowSize.width]);

    return (
      <div className={styles.wrapper}>
        <HomePageMain onExecuteScroll={handleExecuteScroll}/>
        <BeginningHomePage
          beginningSectionRef={beginningSection}
          beginningScroll={beginningScroll}
          beginningOpacity={beginningOpacity}
        />
        <div className={styles.fadeWrapper}>
          <MintWaterway
            mintWaterwaySection={mintWaterwaySection}
            mintTranslate={mintTranslate}
            activeWaterwayTab={activeWaterwayTab}
            setActiveWaterwayTab={setActiveWaterwayTab}
          />
          <Slider/>
          <footer className={styles.footerContainer}>
            <img src={footer.src} alt="" className={styles.footerBackground}/>
            <img src={light.src} alt="" className={styles.footerLight}/>
            <div className={styles.container}>
              <div className={styles.faq}>
                <h2 className={styles.mainTitle}>Faq</h2>
                <Accordion accordionItems={ACCORDION_ITEMS}/>
              </div>
              <div className={styles.footer}>
                <div className={styles.joinTop}>
                  <span className={styles.fMainTitle}>Join</span>
                  <span className={styles.fMainTitle}>Our</span>
                </div>
                <div className={styles.joinBot}>
                  <img src="/assets/img/home-page/footer/footer-arrow.svg" alt=""/>
                  <span className={styles.fMainTitle}>social media</span>
                </div>

                <div className={styles.socials}>
                  <a href="#" className={styles.btn}
                  ><span>join</span><img src="/assets/img/home-page/footer/twitter-logo.svg" alt=""/><span>twitter</span></a
                  >
                  <a href="#" className={styles.btn}
                  ><span>join</span>
                    <img src="/assets/img/home-page/footer/instagram-logo.svg" alt=""/><span>instagram</span></a
                  >
                  <a href="#" className={styles.btn}
                  ><span>join</span><img src="/assets/img/home-page/footer/discord-logo.svg" alt=""/><span>discord</span></a
                  >
                </div>

                <div className={styles.terms}>
                  <a href="">TERMS & CONDITIONS</a>
                  <a href="">PRIVACY POLICY</a>
                </div>
                <div className={styles.powered}>
                  <a href="https://www.niftables.com/" rel="noreferrer" className={styles.powered} target="_blank">
                    <img src="/assets/img/home-page/footer/poweredby.svg" alt="powered by niftables"/>
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }
;

export default HomePage;
