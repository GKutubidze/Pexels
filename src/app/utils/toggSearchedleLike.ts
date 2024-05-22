export const toggSearchedleLike = (id: number,setPhotos) => {

    setPhotos((prevPhotos) => {
      const updatedPhotos = prevPhotos.photos.map((photo) => {
        if (photo.id === id) {
          return { ...photo, liked: !photo.liked };
        }
        return photo;
      });
      console.log(context.photos.photos[id])

      return { ...prevPhotos, photos: updatedPhotos };

    });
  };
  const handleImageLoad = () => {
    console.log("Image loaded successfully");
  };