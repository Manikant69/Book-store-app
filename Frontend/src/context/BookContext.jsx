import { createContext, useContext} from "react";

export const BookContext = createContext({
    books:[
        {
            _id:"1",
            name:"book name",
            authorName:"",
            genre:"",
            price:34,
            publishYear:"2025",
            coverImage:"",
            description:"",
            rating:4.5,
            inStock:true,
            langauge:"Hindi"
        }
    ],

    addBook:(book) =>{},
    deleteBook:(id) =>{}
})

export const useBook = () =>{
    return useContext(BookContext);
}

export const BookProvider = BookContext.Provider;