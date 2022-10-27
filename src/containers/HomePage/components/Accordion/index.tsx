import React, { FC, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { sliceIntoChunks } from '@utils/array-utils';
import cn from 'classnames';

type accordionItemType = {
  title: string
  content: string
}

type Props = {
  accordionItems: accordionItemType[]
}


type AccordionItemProps = {
  title: string
  content: string
  index1: number
  index2: number
  showText: number | null
  handleShowText: (number) => void
}

const AccordionItem: FC<AccordionItemProps> = (
  {index1, index2, handleShowText, showText, title, content}
) => {
  const accordionTitle = useRef<HTMLDivElement>(null);

  return <div
   onClick={() => handleShowText((index1 * 7) + index2)}
   style={{maxHeight: `${accordionTitle.current?.offsetHeight}px`}}
   className={cn(styles.accordionItem, { [styles.show]: showText === (index1 * 7) + index2 })}>
    <div
      ref={accordionTitle}
      className={cn(styles.accordionTitle, { [styles.show]: showText === (index1 * 7) + index2 })}>{title}</div>
    <div className={styles.accordionContent}>
      {content}
    </div>
  </div>
}

export const Accordion: FC<Props> = ({ accordionItems }) => {
  const accordionItemsArray = sliceIntoChunks<accordionItemType>(accordionItems, 7);
  const [showText, setShowText] = useState<number | null>(null);

  const handleShowText = (index: number) => {
    if (index === showText) {
      setShowText(null);
      return;
    }
    setShowText(index);
  };
  return (
    <div className={styles.accordionWrap}>
      {accordionItemsArray.map((item, index1) => <div key={index1} className={styles.accordion}>
        {item.map(({ title, content }, index2) => <AccordionItem
          key={(index1 * 7) + index2}
          index1={index1}
          index2={index2}
          title={title}
          content={content}
          handleShowText={handleShowText}
          showText={showText}
        />)}
      </div>)}

    </div>
  );
};
