import { useEffect, useState } from "react";
import axios, { AxiosInstance } from "axios";
// import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = "https://app.bogordev.my.id/api";

export const useAxios = () => {
  const [axiosInstance, setAxiosInstance] = useState<AxiosInstance | null>(
    null
  );

  useEffect(() => {
    const setupAxios = async () => {
      //   const token = await AsyncStorage.getItem('access_token');
      const token =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMWYyMTkyYTE1N2MyOTZjNzg2ZDQ1ODFlNDBlMzdkYTExYTdkMGFmNzA1MGRjMzkyOWU3NzNlZmQyZjJkMTQwZDM5ZDM2ZDRhYzVlODE4MWMiLCJpYXQiOjE3NDM4MzQ2NzUuMTYyMTQ5LCJuYmYiOjE3NDM4MzQ2NzUuMTYyMTUyLCJleHAiOjE3NzUzNzA2NzUuMTIzNzQyLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.bk5z_DbD-hSPA76RlUyHePFjnIlxbTInb4WxU8Umy4yAIkhEiHHQ9eSkVSXR1-DUV1HXErq81liDndCGJ_jvNnvGG46vTS1tSyVzxxEIu1YVmkRvDTFE72JvasSPlvWYWcNP76p2ZllICeudP79cX2HfImV7vBgUuQP1Bs98bh35eZs-mQMSnHiUk8UUTfo0rRZBX9YuMmc4Y35h2bwuO052DEpiHHeiMaAS_PqtY0cA8WOZLBaylYR2L8OpiSU-6OxkCeW2gfP4jtr5z6sXhD6mIX6bvggnv9LB8zkm0um-DuhkXBmUOHQSHSNpl-iPsg5CB0N-hieC45tnvYWDH7y2aJht9wosiLxw66CTQl-PWl_GhDzrQ4urqluoF-H8dGU6cC8F8Ulg5lC5Xehq3nIvilCbvghUA7rbOGp_E6ZvEKcLpfMYcrvQE7_YbxzpoyaL59yxNDXmkqmxIjS92c0gyR6UWTBjpOiGtFsh8wxYVn8H7kxrP8CQQBUNvJ37hVQEavlihqyYLmWJpZ7EPEu27r220QBA2KBmxPKkbODUNE9RawpC88U1YoCu6FxStevGqDGMhDeWGf7EY2-Vuy95Pk5LWBifJAOuTQuFAhuhwsfWZHFuLIH8VXuabIjwpxAISsWGJSqeaEhLXWFbl-1SBMKroW7KO4PdH2dL-YY";

      const instance = axios.create({
        baseURL: API_BASE_URL,
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      setAxiosInstance(instance);
    };

    setupAxios();
  }, []);

  return axiosInstance;
};
