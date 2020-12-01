import { VisibleField } from "./visible-field";

export class ListPageOptions {
    name: string;
    display_name: string;
    icon: string;
    visibleFields: VisibleField[];
    request: {
        urlGet: 'api/roles'
    }
    actions: string[];

}