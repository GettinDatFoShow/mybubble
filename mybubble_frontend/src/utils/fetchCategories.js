import { client } from "../client";
import { categoryQuery } from "./data";

export const fetchCategories = () => {
    return client.fetch(categoryQuery);
}