import axios from 'axios';
import dotenv from "dotenv";
dotenv.config();

const GOOGLE_CLOUD_API_KEY = process.env.GOOGLE_CLOUD_API_KEY;

// Place Search 를 이용해 얻어온 placeId 를 위도와 경도로 반환하는 함수
export const getPlaceDetails = async (placeId) => {
  console.log("호출: getPlaceDetails");
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,geometry&key=${GOOGLE_CLOUD_API_KEY}`
  );
  const { data } = response;
  const { geometry } = data.result;
  const { location } = geometry;
  console.log(location);
  return location;
};

// 사용자의 장소 검색을 통해 place_id 를 받아오는 함수
export const searchPlace = async (query) => {
  console.log("호출: searchPlace");
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${GOOGLE_CLOUD_API_KEY}`
  );
  const { data } = response;
  console.log(data.results[0].place_id);
  const placeId = data.results[0].place_id;
  const location = await getPlaceDetails(placeId);
  return location;
};