import { useState } from "react";
import { boolean } from "yup";

const usePagination = ( perPage: number = 10) => {

    const [paginationData, setPaginationData] = useState<any>({});
    const [page, setPage] = useState<number>(1);
    const [per_page, setPerPage] = useState<number>(perPage);
    const [reload, setReload] = useState<boolean>(false);

    const onClickSetPageNumber = (pageNumber: number) => {
        setPage(pageNumber);
        setReload(prev => !prev);
    };

    const onClickSetPerPageNumber = (itemPerPage: number) => {
        setPerPage(itemPerPage);
        setReload(prev => !prev);
    };

    return {
        paginationData,
        setPaginationData,
        page,
        setPage,
        per_page,
        setPerPage,
        setReload,
        reload,
        onClickSetPageNumber,
        onClickSetPerPageNumber
    }
};

export default usePagination;