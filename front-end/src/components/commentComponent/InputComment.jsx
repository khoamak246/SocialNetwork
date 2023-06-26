import React, { useEffect, useState } from "react";
import { AiOutlineSmile } from "react-icons/ai";
import IconSelect from "./IconSelect";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewComment,
  createNewNestedComment,
} from "../../thunk/CommentThunk";
import { setResetCommentState } from "../../redux/reducers/CommentSlice";
import { nestedCommentSelector } from "../../redux/selectors/Selector";

export default function InputComment({ post, type }) {
  const [toggleIconSelect, setToggeIconSelect] = useState(false);
  const [inputComment, setInputComment] = useState({ content: "" });
  const [replyAuth, setReplyAuth] = useState("");
  const nestedComment = useSelector(nestedCommentSelector);
  const dispatch = useDispatch();
  const inputRef = useRef();

  useEffect(() => {
    if (type === "PRIVATE") {
      if (nestedComment.commentAuthName.length > 0) {
        let holdContent = inputComment.content;
        let newContent = holdContent.replace(replyAuth, "");
        setInputComment({
          content: `@${nestedComment.commentAuthName} ${newContent}`,
        });
        inputRef.current.focus();
        setReplyAuth(`@${nestedComment.commentAuthName} `);
      }
    }
  }, [nestedComment]);

  useEffect(() => {
    if (inputComment.content.length === 0) {
      dispatch(setResetCommentState());
    }
  }, [inputComment]);

  return (
    <div className="pb-3 w-full flex justify-between relative">
      <div className="w-full flex gap-1">
        <input
          ref={inputRef}
          className="outline-none text-sm w-[80%]"
          type="text"
          placeholder="Enter your comment..."
          value={inputComment.content}
          maxLength={255}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (
                inputComment.content.length !== 0 &&
                nestedComment.nestedId !== 0
              ) {
                console.log("in1");
                let newContent = inputComment.content
                  .replace(replyAuth, "")
                  .trim();
                dispatch(
                  createNewNestedComment({
                    post,
                    content: replyAuth + "</tagged>" + newContent,
                  })
                );
                dispatch(setResetCommentState());
              } else if (inputComment.content.length !== 0) {
                console.log("in2");
                dispatch(
                  createNewComment({ post, content: inputComment.content })
                );
              }
              setInputComment({ content: "" });
            }
          }}
          onChange={(e) => {
            setInputComment({ ...inputComment, content: e.target.value });
          }}
        />
      </div>
      <div className="cursor-pointer">
        <AiOutlineSmile onClick={() => setToggeIconSelect(!toggleIconSelect)} />
      </div>
      {toggleIconSelect && (
        <IconSelect newPost={inputComment} setNewPost={setInputComment} />
      )}
    </div>
  );
}
