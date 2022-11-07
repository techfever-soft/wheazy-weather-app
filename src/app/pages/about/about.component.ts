import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import build from 'src/build';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  public version = build.version;
  public timestamp = new Date(build.timestamp);

  public todos = [
    { done: true, task: "Ajout de la qualité de l'air" },
    { done: false, task: 'Ajout de graphiques' },
    { done: false, task: 'Pouvoir visualiser un jour donné' },
  ];

  public changeLogs = [
    {
      version: '0.1.2',
      description: 'Added changelogs',
      changes: [
        'added changelogs',
        'added snackbars',
        'patched locations in local storage',
      ],
    },
    {
      version: '0.1.1',
      description: 'Added settings and about page',
      changes: [
        'added unit measure setting',
        'added max. locations setting',
        'added debug setting',
      ],
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
