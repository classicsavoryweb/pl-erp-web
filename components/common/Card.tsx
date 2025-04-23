interface CardInterface {
    as?: "div" | "form"
    children: React.ReactNode;
    handleSubmit?: () => void;
};

const Card = ({
    as = "div",
    children,
    handleSubmit
}: CardInterface) => {

    const Tag = as;

    return (
        <Tag
            onSubmit={handleSubmit}
            className="bg-white w-full my-2 p-4 rounded-md"
        >
            {children}
        </Tag>
    );
};

export default Card;
