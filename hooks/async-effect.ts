import { useEffect } from "react";

export const useAsyncEffect = (
    effect: () => Promise<void>|void,
    deps?: React.DependencyList
) => {
    useEffect(() => {
        effect();
    }, deps);
};