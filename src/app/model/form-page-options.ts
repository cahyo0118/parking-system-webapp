import { VisibleField } from "./visible-field";

export class FormPageOptions {
    name: string;
    display_name: string;
    icon: string;
    visibleFields: VisibleField[];
    request: {
        urlGet: 'api/roles'
    }
    actions: string[];

    public static of(object: any): FormPageOptions {

        const formPageOptions: FormPageOptions = new FormPageOptions;

        const properties = Object.entries(object);
        properties.forEach(prop => formPageOptions[prop[0]] = prop[1]);

        return formPageOptions;
    }
}