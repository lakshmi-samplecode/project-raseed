import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RaseedService } from '../../services/raseed-service';

@Component({
  selector: 'app-insights',
  standalone: false,
  templateUrl: './insights.html',
  styleUrl: './insights.scss'
})
export class Insights {
  insightsList:any;
  constructor(private dialog: MatDialog,private receiptService: RaseedService,){
    this.insightsList = this.receiptService.receiptsForInsights;
  }
}
