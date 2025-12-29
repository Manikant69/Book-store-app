import { createContext, useContext} from "react";

export const BookContext = createContext({
    books: [],
    booksLoading: false,
    addBook: (book) => {},
    deleteBook: (id) => {}
})

export const useBook = () =>{
    return useContext(BookContext);
}

export const BookProvider = BookContext.Provider;