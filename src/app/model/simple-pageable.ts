export class SimplePageable {
    private currentPage: number = 1;
    private lastPage: number = 1;

    limit: number = 10;
    offset: number = 0;

    from: number = 1;
    to: number = 10;
    total: number = 10;

    setValue(
        limit,
        offset,
        from,
        to,
        total,
    ) {
        this.limit = limit;
        this.offset = offset;
        this.from = from;
        this.to = to;
        this.total = total;

        this.currentPage = Math.floor(this.offset / this.limit) + Number(1);
        this.lastPage = Math.ceil(this.total / this.limit);
    }

    setTotal(total) {
        this.total = total;
        this.currentPage = Math.floor(this.offset / this.limit) + Number(1);
        this.lastPage = Math.ceil(this.total / this.limit);
    }

    goFirst() {
        this.offset = 0;
        this.currentPage = 1;
    }

    goPrevious() {
        this.offset = Number(this.offset) - Number(this.limit);
        this.currentPage--;
        // this.offset = this.limit * this.currentPage;
    }

    goNext() {
        this.offset = Number(this.offset) + Number(this.limit);
        this.currentPage++;
        // this.offset = this.limit * this.currentPage;
    }

    goLast() {
        this.offset = Number(this.total) - (Number(this.total) % Number(this.limit));
        this.currentPage = Math.round(Number(this.total) / Number(this.offset));
        // this.offset = this.limit * this.currentPage;
    }

    goCustom(page: number) {
        this.currentPage = Number(page);
        this.offset = this.limit * (this.currentPage - 1);
    }

}