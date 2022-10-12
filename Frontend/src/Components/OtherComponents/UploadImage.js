import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UploadImage() {
      const [file, setFile] = useState('');
      const [filename, setFilename] = useState('Choose File');
      const [uploadedFile, setUploadedFile] = useState({});
      const [message, setMessage] = useState('');
      // const [image, setImage] = useState([]);
      // const [imageData, setImageData] = useState(false);

      const handleImage = (e) => {
            setFile(e.target.files[0]);
            setFilename(e.target.files[0].name);
            console.log(e.target.files[0])
            console.log(e.target.files[0].name)
      };


      const handleSubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append('image', file);

            const config = {
                  headers: {
                        'Content-Type': 'multipart/form-data',
                  },
            }
            axios
                  .post('http://localhost:3005/upload', formData, config)
                  .then(res => {
                        console.log(res);
                        console.log(formData);
                        alert("Image upload successfully");
                  });
            //   const { fileName, filePath } = res.data;
            //   setUploadedFile({ fileName, filePath }); 
            // await axios.get('http://localhost:3005/getImage')
            //       .then(res => {
            //             if (res.data.imageData === true) {
            //                   setImage(res.data.uploadImage[0].imageName);
            //                   setImageData(true);
            //                   console.log(res.data)
            //             }
            //             else {
            //                   setImageData(false);
            //                   console.log('Image not taken')
            //             }
            //       })     
      };

      return (
            <>
                  <div>
                        <form onSubmit={handleSubmit}>
                              <h2>store image: 
                                    <input type="file" name="image" accept='image/*' onChange={handleImage} />
                                    <input type="submit" value="Upload" />
                              </h2>
                        </form>
                        {/* {imageData && <img className='profileImage' src={`http://localhost:3005/public/uploads/${image}`} alt='Profile' /> } */}

                        {/* // method="post" action="http://localhost:3005/photoDB" enctype="multipart/form-data" onChange={handleImage}  onSubmit={handleSubmit} */}
                  </div>
            </>
      );
}

export default UploadImage;
