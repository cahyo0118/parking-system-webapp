export class Pageable {
    current_page: any;
    first_page_url: any;
    from: any;
    last_page: any;
    last_page_url: any;
    next_page_url: any;
    path: any;
    per_page: any;
    prev_page_url: any;
    to: any;
    total: any;

    setValues(responseObject: any) {
        this.current_page = responseObject.current_page;
        this.first_page_url = responseObject.first_page_url;
        this.from = responseObject.from;
        this.last_page = responseObject.last_page;
        this.last_page_url = responseObject.last_page_url;
        this.next_page_url = responseObject.next_page_url;
        this.path = responseObject.path;
        this.per_page = responseObject.per_page;
        this.prev_page_url = responseObject.prev_page_url;
        this.to = responseObject.to;
        this.total = responseObject.total;
    }
}