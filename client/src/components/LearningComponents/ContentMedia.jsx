import './LearningComponentsStyles.css'

const ContentMedia = ({ content }) => {
  return (
    <>
      {content.link && (
        <div className="content-iframe">
          <iframe
            src={content.link}
            frameBorder="0"
            allowFullScreen
            title={content.title}
          />
        </div>
      )}
      
      {content.images && content.images.length > 0 && (
        <div className="content-images">
          {content.images.map((img, index) => (
            <img key={index} src={img} alt={`${content.title} - image ${index + 1}`} />
          ))}
        </div>
      )}
      
      {content.videos && content.videos.length > 0 && (
        <div className="content-videos">
          <iframe
            width="560"
            height="315"
            src={content.videos}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </>
  )
}

export default ContentMedia