/**
 * @fileoverview
 *  Test helpers for use with jQuery qunit testing framework.
 *  
 * @author Graham Klyne
 * @version $Id: jquery.model.js 485 2009-10-08 08:52:45Z gk-google@ninebynine.org $
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

/**
 * Test for value in given range
 */
function range(val, lo, hi, message) {
  var result = (val>=lo) && (val<=hi);
  message = message || (result ? "okay" : "failed");
  if (typeof val == "string") { val = parseFloat(val); };
  QUnit.ok( result, 
      ( result 
          ? message + ": " + val 
          : message + ", value " + val + " not in range ["+lo+".."+hi+"]"
      ));
}

// End.
