import { useState, useEffect} from 'react';

function Result(){

  useEffect(() => {

    const hasFetched = sessionStorage.getItem('hasFetched');

    fetch('http://localhost:8081/rest/result',{
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      setContentList(data.data); // 後端回傳 ApiResponse<List<ClothDto>>
    })
    .catch(error => console.error('Fetch error:', error));

  }, []);

  return(
    <>
      <div>
        Hello
      </div>
    </>
  )

};

export default Result; 