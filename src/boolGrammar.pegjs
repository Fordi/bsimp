LooseExpression = _ expr:(PolishExpression / Expression) _ { return expr; }

Expression = Union / Group

Group
  = '(' expr:LooseExpression ')' { return expr; }
  / '[' expr:LooseExpression ']' { return expr; }

TerseInversion
  = InvertOperation f:Term

Inversion
  = InvertOperation f:(Group / Symbol / Boolean / Inversion) { return ['NOT', f] }

PolishOperand
  = Separator expr:Expression { return expr; }

PolishExpression
  = op:Operation operands:PolishOperand+ {
    if (op === 'AND_NOT' || op === 'OR_NOT') {
      return [
        op.substring(1),
        ...operands.map(t => ['NOT', t])
      ];
    }
    return [op, ...operands];
  }

UnionPart
  = _ o:UnionOperation _ t:Intersection { return [o, t]; }

Union
 = head:Intersection tail:UnionPart* {
    return (
      tail.length === 0
      ? head
      : ['OR', head, ...tail.map((e) => e[0] === 'OR_NOT' ? ['NOT', e[1]] : e[1])]
    );
 }

Term
  = Group
  / Inversion
  / Boolean
  / Symbol

IntersectionPart
  = o:(_ IntersectionOperation _)? t:Term { return [o ? o[1] : 'AND', t]; }

Intersection
  = head:Term tail:IntersectionPart* {
    return (
      tail.length === 0
      ? head
      : ['AND', head, ...tail.map((e) => e[0] === 'AND_NOT' ? ['NOT', e[1]] : e[1])]
    );
  }

Boolean
  = ([Tt][Rr][Uu][Ee] / "⊤" / "1" / "■")  { return 'TRUE'; }
  / ([Ff][Aa][Ll][Ss][Ee] / "0" / "⊥" / "□") { return 'FALSE'; }

Symbol
  = S:[A-Za-z] { return S; }

Operation
  = IntersectionOperation
  / UnionOperation
  / InvertOperation

IntersectionOperation
  = ([Aa][Nn][Dd] / "&&" / "&" / "*" / "n" / "∩" / "∧" / "^" / "·") { return 'AND'; }
  / ("∖" / "\\") { return 'AND_NOT'; }

UnionOperation
  = ([Oo][Rr] / "||" / "|" / "∥" / "+" / "u" / "∪" / "∨" / "v") { return 'OR'; }
  / ('-') { return 'OR_NOT'; }

InvertOperation
  = ([Nn][Oo][Tt] / "!" / "~" / "¬") { return 'NOT'; }

_ "optional whitespace"
  = [ \t\n\r]*

__ "required whitespace"
  = [ \t\n\r]+

Separator
  = __ / _ "," _
