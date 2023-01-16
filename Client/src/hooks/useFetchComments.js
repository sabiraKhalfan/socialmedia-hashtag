import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchComments } from "../api/CommentRequest";
const useFetchComments = (postId) => {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetchComments(postId)
      .then((response) => {
        setComments(response.data);
        setLoading(false);
        setError(false);
      })
      .catch((err) => {
        if (err.response.data.expired) {
          return dispatch({ type: "LOGOUT" });
        }
        console.log(err);
        setError(true);
      });
  }, []);

  return { loading, error, setComments, comments, setLoading };
};

export default useFetchComments;
