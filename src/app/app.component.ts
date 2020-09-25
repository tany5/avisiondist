import { Component} from '@angular/core';
import { ScriptserviceService } from './scriptservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  constructor(private scriptService: ScriptserviceService) {

    console.log('Loading External Scripts');
    this.scriptService.load('slim', 'popper', 'bootstrap', 'ionicons', 'wow');
  }
  
}
