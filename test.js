let files = {
  "boardId": 1,
  "email": "test1@naver.com",
  "nickname": "test1",
  "title": "test",
  "content": "test",
  "status": "PUBLIC",
  "createdAt": "2023-11-13T03:58:27.503Z",
  "updatedAt": "2023-11-13T03:58:27.503Z",
  "images": [
      {
          "imageId": 1,
          "url": "https://mono-market-image.s3.ap-northeast-2.amazonaws.com/images/1699847907327_DB.png",
          "boardStatus": "PUBLIC",
          "createdAt": "2023-11-13T03:58:27.509Z",
          "updatedAt": "2023-11-13T03:58:27.509Z"
      },
      {
          "imageId": 2,
          "url": "https://mono-market-image.s3.ap-northeast-2.amazonaws.com/images/1699847907372_clip.png",
          "boardStatus": "PUBLIC",
          "createdAt": "2023-11-13T03:58:27.516Z",
          "updatedAt": "2023-11-13T03:58:27.516Z"
      }
  ]
}

const images = files['images']

images.map( image => {
    const imagePath = new URL(image.url).pathname.substring(1)
    return deleteS3(imagePath)
})

console.log('images', images)
