import {
  IDisposable, DisposableDelegate
} from '@lumino/disposable';

import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  ToolbarButton
} from '@jupyterlab/apputils';

import {
  DocumentRegistry
} from '@jupyterlab/docregistry';

import {
  // NotebookActions, 
  NotebookPanel, INotebookModel, INotebookTracker
} from '@jupyterlab/notebook';


/**
 * The plugin registration information.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  activate,
  id: 'meta-toggle',
  requires:[INotebookTracker],
  autoStart: true
};


/**
 * A notebook widget extension that adds a button to the toolbar.
 */
export
class ButtonExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {

  tracker: INotebookTracker;

  constructor(tracker:INotebookTracker){
    this.tracker = tracker;
  }
  /**
   * Create a new extension object.
   */
  createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {
    let callback = () => {
      // NotebookActions.runAll(panel.content, context.sessionContext);
      console.log('active cell', this.tracker.activeCell);
      console.log(
        'active cell metadata',
        this.tracker.activeCell.model.metadata
      );
      const key = "meta-toggle";
      const cellMeta = this.tracker.activeCell.model.metadata;
      const value = cellMeta.get(key);
      let newValue = false;
      if (value === false){ newValue = true}
      cellMeta.set(key, newValue)
    };
    let button = new ToolbarButton({
      className: 'myButton',
      iconClass: 'fa fa-fast-forward',
      onClick: callback,
      tooltip: 'Toggle'
    });

    panel.toolbar.insertItem(0, 'runAll', button);
    return new DisposableDelegate(() => {
      button.dispose();
    });
  }
}

/**
 * Activate the extension.
 */
function activate(app: JupyterFrontEnd, tracker:INotebookTracker) {
  console.log("tracker", tracker)
  app.docRegistry.addWidgetExtension('Notebook', new ButtonExtension(tracker));
};


/**
 * Export the plugin as default.
 */
export default plugin;