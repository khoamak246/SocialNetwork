export const authAuthenticationState = (state) => state.auth;

export const toggleSelector = (state) => state.toggle;

export const currentUserSignInSelector = (state) => state.user;

export const allPostSelector = (state) => state.post;

// HOME PAGE
export const pagingSortingSelector = (state) =>
  state.homePage.pageSortingFetching;

export const homePageContentSelector = (state) => state.homePage.content;
export const isStillHavingContentSelector = (state) =>
  state.homePage.isStillHavingContent;

// PROFILE
export const profileUserDetailSelector = (state) => state.profile.userDetail;

export const profilePostSelector = (state) => state.profile.post;

export const profileSavedSelector = (state) => state.profile.saved;

//COMMENT
export const nestedCommentSelector = (state) => state.comment;

//ROOM
export const roomSelector = (state) => state.room.room;
export const selectRoomSelector = (state) => state.room.selectRoom;

//STORY
export const storySelector = (state) => state.story;
