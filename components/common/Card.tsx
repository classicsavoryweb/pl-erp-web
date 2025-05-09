import React from "react";

interface CardInterface {
	as?: "div" | "form";
	children: React.ReactNode;
	handleSubmit?: () => void;
	loading?: boolean;
	size?: "big" | "small";
}

const Card = ({
	as = "div",
	children,
	handleSubmit,
	loading = false,
	size = "small"
}: CardInterface) => {
  const Tag = as;

  const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!loading && handleSubmit) {
			handleSubmit();
		}
  };

  return (
    <Tag
      	onSubmit={as === "form" ? handleFormSubmit : undefined}
      	className="bg-zinc-50 w-full my-2 p-4 rounded-md"
    >
		{loading ? (
			<>
			{ (size === "small" || size === "big") && 

				<div className="animate-pulse duration-500 space-y-4">
					<div className="h-4 bg-zinc-200 rounded w-3/4" />
					<div className="h-4 bg-zinc-200 rounded w-full" />
					<div className="h-4 bg-zinc-200 rounded w-5/6" />
					<div className="h-10 bg-zinc-200 rounded w-1/3 mt-4" />
				</div>
			}
			{ size === "big" &&
				<>
					<div className="mt-10 animate-pulse duration-500 space-y-4">
						<div className="h-4 bg-zinc-200 rounded w-3/4" />
						<div className="h-4 bg-zinc-200 rounded w-full" />
						<div className="h-4 bg-zinc-200 rounded w-5/6" />
						<div className="h-10 bg-zinc-200 rounded w-1/3 mt-4" />
					</div>

					<div className="mt-10 animate-pulse duration-500 space-y-4">
						<div className="h-4 bg-zinc-200 rounded w-3/4" />
						<div className="h-4 bg-zinc-200 rounded w-full" />
						<div className="h-4 bg-zinc-200 rounded w-5/6" />
						<div className="h-10 bg-zinc-200 rounded w-1/3 mt-4" />
					</div>
				</>
			}
			</>    
		) : (
			children
		)}
    </Tag>
  );
};

export default Card;
