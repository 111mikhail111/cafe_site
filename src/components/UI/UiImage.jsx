export default function UiImage ({source, name}) {
    return (
        <div className="ui-image-container">
          <img
            src={source}
            alt={name}
            className="ui-image"
          />
        </div>
    )
}