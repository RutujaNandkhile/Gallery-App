import { PicsumImage } from '@/types';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppTabParamList = {
  HomeTab: undefined;
  FavoritesTab: undefined;
  ProfileTab: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  ImageDetails: { image: PicsumImage };
};

export type FavoritesStackParamList = {
  Favorites: undefined;
  ImageDetails: { image: PicsumImage };
};
