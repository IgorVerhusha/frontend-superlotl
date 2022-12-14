/* global JSX*/
import Link from 'next/link';

import SocialIconPlaceholder from '../SocialIconPlaceholder';
import Image from 'next/image';
import { ISocialIcon } from 'src/types/general';

export default function SocialIcon({
  fileName,
  linkTo,
  name,
}: ISocialIcon): JSX.Element {
  return (
    <Link href={linkTo}>
      <a target='_blank' title={name}>
        <SocialIconPlaceholder>{fileName}</SocialIconPlaceholder>
      </a>
    </Link>
  );
}
