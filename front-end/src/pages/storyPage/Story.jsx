import React, { useEffect } from "react";
import StoryView from "../../components/storyComponent/StoryView";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  authAuthenticationState,
  currentUserSignInSelector,
} from "../../redux/selectors/Selector";
import { useCookies } from "react-cookie";
import { authSignIn } from "../../thunk/AuthThunk";
import { userFindByExpectedValue } from "../../thunk/UserThunk";
import { useState } from "react";
import { GET_FIND_STORY_BY_ID } from "../../api/service/PostService";
import { postCreateNewBehavior } from "../../thunk/PostThunk";

export default function Story() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUserSignIn = useSelector(currentUserSignInSelector);
  const [cookie, setCookie] = useCookies();
  const [currentStory, setCurrentStory] = useState();
  const param = useParams();

  useEffect(() => {
    let sendValue = {
      token: cookie.token,
      storyId: param.storyId,
    };
    async function fetchData() {
      let response = await GET_FIND_STORY_BY_ID(sendValue);
      if (response.status === 404) {
        navigate("*");
      } else {
        setCurrentStory(response.data.data);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (currentStory) {
      console.log(currentStory);
      let check = false;
      let { postBehavior } = currentStory;
      for (let i = 0; i < postBehavior.length; i++) {
        const val = postBehavior[i];
        if (val.type === "story" && val.users.id === currentUserSignIn.id) {
          check = true;
          break;
        }
      }

      if (!check) {
        dispatch(postCreateNewBehavior({ post: currentStory, type: "story" }));
      }
    }
  }, [currentStory]);

  return (
    <div>
      <StoryView stories={currentStory} />
    </div>
  );
}
