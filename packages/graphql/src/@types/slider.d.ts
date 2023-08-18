declare module 'slider' {
  export interface SliderTableModel {
    readonly id: string;
    readonly page: string | null;
    readonly template: string | null;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly displayName: string;
    readonly slidesToShow: number;
    readonly pauseOnHover: boolean;
    readonly autoplaySpeed: number;
  }
  export type SliderTableRecord = Omit<SliderTableModel, 'createdAt' | 'updatedAt'> & {
    readonly createdAt: Date;
    readonly updatedAt: Date;
  };

  export interface SliderSlidesTableModel {
    readonly id: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly slider: string;
    readonly enabled: boolean;
    readonly order: number;
    readonly image: string;
  }

  export type SliderSlidesTableRecord = Omit<SliderSlidesTableModel, 'createdAt' | 'updatedAt'> & {
    readonly createdAt: Date;
    readonly updatedAt: Date;
  };

  export interface SliderSlide {
    readonly id: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly slider: string;
    readonly enabled: boolean;
    readonly order: number;
    readonly image: string;
  }
}
