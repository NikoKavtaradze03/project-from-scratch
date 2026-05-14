type Profile = {
  username: string;
  bio: string | null;
  image: string | null;
  following: boolean;
};

export type GetProfileResponse = {
  profile: Profile;
};
