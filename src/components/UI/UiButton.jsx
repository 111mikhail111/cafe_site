const UiButton = ({
    variant = "default",
    size = "default",
    className,
    children,
    onClick
}) => {
    let baseClassName = 'ui-button'; // Базовый класс для всех кнопок

    // Добавляем классы в зависимости от variant
    switch (variant) {
        case "default":
            baseClassName += " ui-button-default";
            break;
        case "destructive":
            baseClassName += " ui-button-destructive";
            break;
        case "outline":
            baseClassName += " ui-button-outline";
            break;
        case "secondary":
            baseClassName += " ui-button-secondary";
            break;
        case "ghost":
            baseClassName += " ui-button-ghost";
            break;
        case "link":
            baseClassName += " ui-button-link";
            break;
        default:
            baseClassName += " ui-button-default";
    }

    // Добавляем классы в зависимости от size
    switch (size) {
        case "sm":
            baseClassName += " ui-button-sm";
            break;
        case "lg":
            baseClassName += " ui-button-lg";
            break;
        case "icon":
            baseClassName += " ui-button-icon";
            break;
        default:
            baseClassName += " ui-button-default";
    }

    // Добавляем дополнительные классы
    if (className) {
        baseClassName += ` ${className}`;
    }

    return (
        <button
            className={baseClassName}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default UiButton;