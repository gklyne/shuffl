/**
 * Test store for RDFparser, extracted from tabulator/test/rdf/rdfparser.test.html
 */

function TestStore() {
    this.bn = 97 // 'a'
    this.triples = []
    this.collections = {}
    this.sym = function (uri) {
        return {val: uri, type: "sym"}
    }
    this.collection = function () {
        var store = this
        var c = new Object()
        c.val = this.bn++
        c.type = "collection"
        c.elements = []
        c.append = function (el) { this.elements[this.elements.length]=el }
        c.close = function () {
            var rdfns = "http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            if (this.elements.length == 0) {
                store.add(this,store.sym(rdfns+"first"),store.sym(rdfns+"nil"))
                return
            }
            var cn = this
            store.add(cn,store.sym(rdfns+"first"),this.elements[0])
            for (var x=1; x<this.elements.length; x++) {
                var nn = store.bnode()
                store.add(cn,store.sym(rdfns+"rest"),nn)
                cn = nn
                store.add(cn,store.sym(rdfns+"first"),this.elements[x])
            }
            store.add(cn,store.sym(rdfns+"rest"),store.sym(rdfns+"nil"))
        }
        return c
    }
    this.bnode = function () {
        return {val: this.bn++, type: "bnode"}
    }
    this.literal = function (val, lang, type) {
        return {val: val, datatype: type, type: "literal", lang: lang}
    }
    this.add = function (s,p,o,w) {
        //ÊSubject
        if (o.type == "literal" && o.datatype
            == "http://www.w3.org/1999/02/22-rdf-syntax-ns#XMLLiteral") {
            var val = ""
            var xmls = new XMLSerializer()
            for (var x=0; x < o.val.childNodes.length; x++) {
                val += xmls.serializeToString(o.val.childNodes[x])
            }
            o.val = val
        }
        if (s.type == "bnode" || s.type == "collection") {
            s = "_:"+String.fromCharCode(s.val)
        }
        else {
            s = "<"+s.val+">"
        }
        // Property
        s += " <" + p.val + "> "
        // Object
        if (o.type == "literal") {
            s += "\"" + o.val + "\""
            if (o.datatype) { s += "^^<"+o.datatype+">" }
            if (o.lang != "") { s += "@"+o.lang }
        }
        else if (o.type == "bnode" || o.type == "collection") {
            s += "_:"+String.fromCharCode(o.val)
        }
        else {
            s += "<" + o.val + ">"
        }
        // Test store contains a list of strings..
        this.triples[this.triples.length] = s + " ."
    }
}
