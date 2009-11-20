/**
 * @fileoverview
 *  Shuffl application main code.
 *  
 * @author Graham Klyne
 * @version $Id$
 * 
 * Coypyright (C) 2009, University of Oxford
 *
 * Licensed under the MIT License.  You may obtain a copy of the License at:
 *
 *     http://www.opensource.org/licenses/mit-license.php
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If errors are seen, run Eclipse "(right-click project) > Validate" option

// Meanwhile, this suppresses many distracting errors:
jQuery = jQuery;

// ----------------------------------------------------------------
// Workspace layout and sizing
// ----------------------------------------------------------------

/**
 * Resize main shuffl spaces to fit current window
 */    
shuffl.resize = function()
{
    log.debug("Resize workspace");
    // Adjust height of layout area
    var layout  = jQuery("#layout"); 
    var sheight = jQuery("#stockbar").outerHeight();
    var fheight = jQuery("#footer").outerHeight();
    var vmargin = parseInt(layout.css('margin-bottom'), 10);
    layout.height(layout.parent().innerHeight() - sheight - vmargin*7 - fheight);
};

// ----------------------------------------------------------------
// Workspace menu command handlers
// ----------------------------------------------------------------

/**
 * Load workspace completion handler that resets the workspace when an error 
 * is returned
 */
shuffl.resetWorkspaceOnError = function (val)
{
    if (val instanceof Error)
    {
        shuffl.resetWorkspace(function () { shuffl.showError(val); });
    }
};

/**
 * Display message when an error is returned
 */
shuffl.showMessageOnError = function (val)
{
    if (val instanceof Error)
    {
        shuffl.showError(val);
    }
    else
    {
        shuffl.showLocation(jQuery('#workspace').data('location').toString());
    }
};

/**
 * Save current workspace values as defaults in subsequent dialogs
 */
shuffl.saveWorkspaceDefaults = function ()
{
    log.debug("shuffl.saveWorkspaceDefaults");
    var ws     = jQuery('#workspace');
    var wsdata = ws.data('wsdata');
    if (wsdata)
    {
        log.debug("- wsuri "+wsdata['shuffl:wsuri']+", wsname "+ws.data('wsname'));
        ws.data('default_wsuri',   wsdata['shuffl:wsuri']);
        ws.data('default_wsname',  ws.data('wsname'));
    }
    else
    {
        shuffl.showError("No default workspace established");
    }
};

// TODO: refactor dialog logic and form

/**
 * Menu command "Open workspace..."
 */
shuffl.menuOpenWorkspace = function ()
{
    // Use current location (atomuri/feeduri) as default base
    log.debug("shuffl.menuLoadWorkspace");
    var wsuri  = jQuery('#workspace').data('default_wsuri');
    var wsname = jQuery('#workspace').data('default_wsname');
    var wsdata = jQuery('#workspace').data('wsdata');
    if (wsdata)
    {
        wsuri  = wsdata['shuffl:wsuri'];
        wsname = jQuery('#workspace').data('wsname');
    };
    log.debug("- wsuri "+wsuri+", wsname "+wsname);
    jQuery('#open_wsuri').val(wsuri);
    jQuery('#open_wsname').val(wsname);
    // Open dialog to obtain location of workspace data
    jQuery("#dialog_open").dialog(
        { bgiframe: true,
          modal: true,
          dialogClass: 'dialog-open',
          width: 800,
          buttons: {
              Ok: function() {
                  wsuri  = jQuery('#open_wsuri').val();
                  wsname = jQuery('#open_wsname').val();
                  log.debug("- OK: wsuri "+wsuri+", wsname "+wsname);
                  jQuery(this).dialog('destroy');
                  // Save cards, capture locations (or bail if error),
                  // assemble workspace description and save, and
                  // display location saved:
                  shuffl.resetWorkspace(function(val) {
                      shuffl.loadWorkspace(wsuri, shuffl.resetWorkspaceOnError);                    
                  });
              },
              Cancel: function() {
                  log.debug("- Cancel");
                  jQuery(this).dialog('destroy');
              }
          }
        });
};

/**
 * Menu command "Save workspace"
 */
shuffl.menuSaveWorkspace = function ()
{
    log.debug("shuffl.menuSaveWorkspace");
    shuffl.updateWorkspace(shuffl.showMessageOnError);
};

/**
 * Menu command "Save as new workspace..."
 */
shuffl.menuSaveNewWorkspace = function ()
{
    // Use current location (atomuri/feeduri) as default base
    log.debug("shuffl.menuSaveNewWorkspace");
    var wsuri  = jQuery('#workspace').data('wsuri');
    var wsname = jQuery('#workspace').data('wsname');
    var wsdata = jQuery('#workspace').data('wsdata');
    jQuery('#save_wsuri').val(wsuri);
    jQuery('#save_wsname').val(wsname);
    jQuery("#dialog_save").dialog(
        { bgiframe: true,
          modal: true,
          dialogClass: 'dialog-save',
          width: 800,
          buttons: {
              Ok: function() {
                  wsuri  = jQuery('#save_wsuri').val();
                  wsname = jQuery('#save_wsname').val();
                  jQuery(this).dialog('destroy');
                  log.debug("- OK: wsuri "+wsuri+", wsname "+wsname);
                  // Save cards, capture locations (or bail if error),
                  // assemble workspace description and save, and
                  // display location saved:
                  if (shuffl.invalidWorkspaceName(wsuri, wsname, shuffl.showMessageOnError)) return;
                  var coluri = jQuery.uri("..", wsuri);
                  shuffl.deleteWorkspace(wsuri, function(val,next) {
                      shuffl.saveNewWorkspace(coluri, wsname, 
                          shuffl.showMessageOnError);
                  });
              },
              Cancel: function() {
                  log.debug("- Cancel");
                  jQuery(this).dialog('destroy');
              }
          }
        });
};

// ----------------------------------------------------------------
// Menu and dialogs HTML templates
// ----------------------------------------------------------------

shuffl.MainMenuHTML =
    "<div class='contextMenu' id='workspacemenuoptions'  style='display:none;'>\n"+
    "  <ul>\n"+
    "    <li id='open'><img src='folder.png' />Open workspace...</li>\n"+
    "    <li id='save'><img src='folder.png' />Save workspace</li>\n"+
    "    <li id='savenew'><img src='folder.png' />Save as new workspace...</li>\n"+
    "  </ul>\n"+
    "</div>\n";

shuffl.OpenDialogHTML =
    "<div id='dialog_open' title='Open workspace' style='display:none;'>\n"+
    "  <p>Enter the URI of an Atom Publishing Protocol service, AtomPub feed path and workspace name where the workspace is to be loaded from.</p>\n"+
    "  <form>\n"+
    "    <fieldset>\n"+
    "      <legend>Location of workspace data</legend>\n"+
    "      <label for='open_atomuri'>Workspace URI:</label>\n"+
    "      <input type='text' name='wsuri' id='open_wsuri' class='text ui-widget-content ui-corner-all' size='80'/>\n"+
    "      <label for='open_wsname'>Workspace name:</label>\n"+
    "      <input type='text' name='wsname' id='open_wsname' class='text ui-widget-content ui-corner-all' size='80'/>\n"+
    "    </fieldset>\n"+
    "  </form>\n"+
    "</div>\n";

shuffl.SaveNewDialogHTML =
    "<div id='dialog_save' title='Save as new workspace' style='display:none;'>\n"+
    "  <p>Enter the URI of an Atom Publishing Protocol service, AtomPub feed path and workspace name where the new workspace is to be saved.</p>\n"+
    "  <form>\n"+
    "    <fieldset>\n"+
    "      <legend>Location for saved workspace</legend>\n"+
    "      <label for='save_atomuri'>Workspace URI:</label>\n"+
    "      <input type='text' name='wsuri' id='save_wsuri' class='text ui-widget-content ui-corner-all' size='80'/>\n"+
    "      <label for='save_wsname'>Workspace name:</label>\n"+
    "      <input type='text' name='wsname' id='save_wsname' class='text ui-widget-content ui-corner-all' size='80'/>\n"+
    "    </fieldset>\n"+
    "  </form>\n"+
    "</div>\n";

// ----------------------------------------------------------------
// Start-up logic
// ----------------------------------------------------------------

jQuery(document).ready(function()
{
    log.info("shuffl starting");

    // Add menus and dialogs to the workspace
    jQuery("body").append(shuffl.MainMenuHTML);
    jQuery("body").append(shuffl.OpenDialogHTML);
    jQuery("body").append(shuffl.SaveNewDialogHTML);

    // Attach card-creation functions to stockpile cards
    log.debug("shuffl: attach card-creation functions to stockpile");
    jQuery("div.shuffl-stockpile").data( 'makeCard', shuffl.createCardFromStock);

    // Size workspace to fit within window (by default, it doesn't on Safari)
    log.debug("shuffl: attach window resize handler)");
    jQuery(window).resize( shuffl.resize );
    shuffl.resize();

    // Connect up drag and drop for creating and moving cards
    // Only cards predefined in the original HTML are hooked up here
    log.debug("shuffl: connect drag-and-drop logic");
    jQuery("div.shuffl-stockpile").draggable(shuffl.stockDraggable);
    jQuery("div.shuffl-card").draggable(shuffl.cardDraggable);
    jQuery("div.shuffl-card").click( function () { shuffl.toFront(jQuery(this)) } );
    jQuery("#layout").droppable({
        accept: "div.shuffl-stockpile",
        drop: 
            function(event, ui) {
                /**
                 * ui.draggable - current draggable element, a jQuery object.
                 * ui.helper - current draggable helper, a jQuery object
                 * ui.position - current position of the draggable helper { top: , left: }
                 * ui.offset - current absolute position of the draggable helper { top: , left: }
                 */
                log.debug("shuffl: drop "+ui.draggable);
                shuffl.dropCard(ui.draggable, jQuery(this), ui.offset);
            }
        });
    
    // TODO: connect up logic for saving changes on-the-fly to backend store
    log.debug("shuffl TODO: connect content save logic");

    // Initialize menu defaults
    jQuery("#workspace").data('default_atomuri', "");
    jQuery("#workspace").data('default_feeduri', "");

    // Create a pop-up workspace menu
    log.debug("shuffl: connect connect workspace menu");
    jQuery('div.shuffl-workspacemenu').contextMenu('workspacemenuoptions', {
        menuStyle: {
            'class': 'shuffl-contextmenu',
            'font-weight': 'bold',
            'background-color': '#DDDDDD',
            'border': 'thin #666666 solid'
            },
        showOnClick: true,
        bindings: {
            'open': function(t) {
                    log.debug('Menu trigger '+t.id+'\nAction is shuffl.menuOpenWorkspace');
                    shuffl.menuOpenWorkspace();
                },
            'save': function(t) {
                    log.debug('Menu trigger '+t.id+'\nAction is shuffl.menuSaveWorkspace');
                    shuffl.menuSaveWorkspace();
                },
            'savenew': function(t) {
                    log.debug('Menu trigger '+t.id+'\nAction is shuffl.menuSaveNewWorkspace');
                    shuffl.menuSaveNewWorkspace();
                }
          }
      });

    // Initialization is done - now it's all event-driven
    log.info("shuffl initialization done");
});

// End.
