import { Component, OnInit } from '@angular/core';
import { Environment } from 'src/app/config/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  test: Date = new Date();

  constructor(
    public env: Environment,
  ) { }

  ngOnInit() {
  }

}
