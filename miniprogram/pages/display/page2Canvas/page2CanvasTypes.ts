export type Props = 'color' | 'backgroundColor' | 'font' | 'wordWrap' | 'src' | 'left' | 'top' | 'right' | 'bottom' | 'height' | 'width' | 'dataset' | 'mode';

export type Offset = {
  left: number,
  top: number,
  right: number,
  bottom: number,
}

export type ComponentProps = Record<Props, any>;