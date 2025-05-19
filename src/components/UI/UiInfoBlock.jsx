export default function UiInfoBlock ({title, Info}) {
    return (
        <div className="ui-card">
          <h1 className="ui-card-title">{title}</h1>
          <div className="ui-card-info">
            <Info/>
          </div>
        </div>
    )
}