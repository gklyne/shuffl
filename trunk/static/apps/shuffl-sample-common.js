/**
 * @fileoverview
 *  Shuffl sample applications common code.
 *  
 * @author Graham Klyne
 * @version $Id: $
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

shuffl.sampleLoadWorkspace = function (wsname)
{
    jQuery(document).ready(function(){
        shuffl.addStorageHandler( 
            { uri:      "http://localhost:8080/exist/atom/edit/"
            , name:     "eXistAtomPub"
            , factory:  shuffl.ExistAtomStorage
            });
        shuffl.addStorageHandler( 
            { uri:      "http://localhost/webdav/"
            , name:     "WebDAV"
            , factory:  shuffl.WebDAVStorage
            });
        shuffl.addStorageHandler( 
            { uri:      "http://localhost/shuffl/"
            , name:     "Shuffl"
            , factory:  shuffl.LocalFileStorage
            });
        shuffl.addStorageHandler( 
            { uri:      "http://shuffl.googlecode.com/svn/trunk/"
            , name:     "GoogleCode"
            , factory:  shuffl.LocalFileStorage
            });
        shuffl.loadWorkspace(wsname, shuffl.saveWorkspaceDefaults);
    });
}; 
