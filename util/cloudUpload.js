const { includes } = require('ramda')
const cloudinary = require('cloudinary').v2
const { ApolloError } = require('apollo-server')

const isType = type => includes(type)
const isImage = isType('image/')

const uploadPhotoCloud = (file, options = {}) => 
  new Promise((resolve, reject) => 
    file.then(({ createReadStream, filename, mimetype, encoding }) => {
      if (isImage(mimetype)) { 
        createReadStream()
          .pipe(cloudinary.uploader.upload_stream(
            {
              use_filename: true,
              unique_filename: true,
              resource_type: 'image',
              folder: `/techio/images${options.dir || '/in-post'}`,
              ...options
            },
            (err, result) => err 
            ? reject(err) 
            : resolve({ ...result, filename, mimetype,encoding })
          ))
      } else { // not is image type
        reject(new ApolloError('File must be image', 'BAD_USER_INPUT'))
      }
    })
  )

const uploadAvatarCloud = file => 
  uploadPhotoCloud(file, {
    dir: '/avatars',
    transformation: [
      { height: 350, width: 350, crop: 'imagga_scale' }
    ]
  })

module.exports = { uploadPhotoCloud, uploadAvatarCloud }
