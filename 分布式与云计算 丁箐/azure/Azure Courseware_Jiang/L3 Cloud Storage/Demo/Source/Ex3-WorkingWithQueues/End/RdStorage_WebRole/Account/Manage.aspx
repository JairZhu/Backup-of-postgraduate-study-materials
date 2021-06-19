<%@ Page Title="Manage Account" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Manage.aspx.cs" Inherits="RdStorage_WebRole.Account.Manage" %>
<%@ Register Src="~/Account/OpenAuthProviders.ascx" TagPrefix="uc" TagName="OpenAuthProviders" %>

<asp:Content ContentPlaceHolderID="MainContent" runat="server">
    <hgroup class="title">
        <h1><%: Title %>.</h1>
    </hgroup>

    <section id="passwordForm">
        <asp:PlaceHolder runat="server" ID="successMessage" Visible="false" ViewStateMode="Disabled">
            <p class="message-success"><%: SuccessMessage %></p>
        </asp:PlaceHolder>

        <p>You're logged in as <strong><%: User.Identity.Name %></strong>.</p>

        <asp:PlaceHolder runat="server" ID="setPassword" Visible="false">
            <p>
                You do not have a local password for this site. Add a local
                password so you can log in without an external login.
            </p>
            <fieldset>
                <legend>Set Password Form</legend>
                <ol>
                    <li>
                        <asp:Label runat="server" AssociatedControlID="password">Password</asp:Label>
                        <asp:TextBox runat="server" ID="password" TextMode="Password" />
                        <asp:RequiredFieldValidator runat="server" ControlToValidate="password"
                            CssClass="field-validation-error" ErrorMessage="The password field is required."
                            Display="Dynamic" ValidationGroup="SetPassword" />
                        
                        <asp:ModelErrorMessage runat="server" ModelStateKey="NewPassword" AssociatedControlID="password"
                            CssClass="field-validation-error" SetFocusOnError="true" />
                        
                    </li>
                    <li>
                        <asp:Label runat="server" AssociatedControlID="confirmPassword">Confirm password</asp:Label>
                        <asp:TextBox runat="server" ID="confirmPassword" TextMode="Password" />
                        <asp:RequiredFieldValidator runat="server" ControlToValidate="confirmPassword"
                            CssClass="field-validation-error" Display="Dynamic" ErrorMessage="The confirm password field is required."
                            ValidationGroup="SetPassword" />
                        <asp:CompareValidator runat="server" ControlToCompare="Password" ControlToValidate="confirmPassword"
                            CssClass="field-validation-error" Display="Dynamic" ErrorMessage="The password and confirmation password do not match."
                            ValidationGroup="SetPassword" />
                    </li>
                </ol>
                <asp:Button runat="server" Text="Set Password" ValidationGroup="SetPassword" OnClick="setPassword_Click" />
            </fieldset>
        </asp:PlaceHolder>

        <asp:PlaceHolder runat="server" ID="changePassword" Visible="false">
            <h3>Change password</h3>
            <asp:ChangePassword runat="server" CancelDestinationPageUrl="~/" ViewStateMode="Disabled" RenderOuterTable="false" SuccessPageUrl="Manage.aspx?m=ChangePwdSuccess">
                <ChangePasswordTemplate>
                    <p class="validation-summary-errors">
                        <asp:Literal runat="server" ID="FailureText" />
                    </p>
                    <fieldset class="changePassword">
                        <legend>Change``ass7rl(��ta|lx8mliwqd>Ƞ�#`��� 0 H`p "(  2T(  d<ol>J  �x(` `   �   �  y`"8% p0d�>/*("!  �a$ !*" a  ` 0 ��   !   �ySx:La�EL(rPjCt8 sqtv1r2�YD="C56rehtZ�ssw���lc`�M:dC�ogi1|DdBo�Xvo[Q=�urrldpP�rsSmrD.>C5pb%�t0j ccmoad:/as`8Laoeh�  ' "  0 0) p $ �"24 0!#   b$ 4�awpT%�tC/9lRdja�l*smrvap$ �"OW�zm�tPdrskrd"!J�sC,as3�8i��sso�$Cj�Ry�"tetMod="x�rwOf$�0����"( (�e!   !�`"�$ `%$`  �"*($ 2$<`pq;BiauI��F)�ldR�tid�dk0 puL�u?(qgB�tr� G�.�rG�To�alanaue%bJu�sen�pqsswg3D"J  %   �@((0 `2 "&b!�   � !(  �� "��y'��a�`�#�aeiD-vah`e`|h�n-epror; C�kks]U{sqwt<"Ph� ctzSm}|`taqS5o�d��htmt$ip RMq��2gt�"
,` �� ! "v"  �`!  '&  ` �(  � �� VAukdau,onR7muP52�iano�Par�skrd$0/<`1$(` 0$`$!!p      l4  � $$ /li>
 8!6@ $ ` �  0�$# (  !!�$�mi`  !p `0(  &e` �   b � (2&(!2 �$<hsP
La�%� :qNat`sopRe�"@Id="N�wPaSs��rlMab%l"`Aqsoci!u�Lk�,R~���Dy'uwR�sew/rd2~Nu(0qVrufzd8o�s<2���m�>
 d   "�g& 8(� �`x h j 0c�c�����q�pz�or�BHx#pun#tqERV%b I�=2\��0G{s7artB�C3#S,aqq'c|�s�1or�e�try�0V�8ta�`g=�QAs�7i6�"$�6K#(` `p`   0 �(0"0  �0� �!� @a 0}�f`�Raq�!�g`E��.dWao�ditgr tni��*seruej"%Gkjtz�To��}�gcpe*�OEXcc�w�Rd"- �    (  (d (� "z� !  1�!``(     #��csCmaqs;"��Dl�%vQji�qtag~-ms�or"(GrRozMu�seg%�"TY� �ew"9as{tord iw B!iUyrdd.b � (` "c 1@"0$ 8$�$  "�B!*00D��v`` rali4etm/nGr?qp�"ChaffApaRS�gs "�/0 �  "�#    (   �(!' 0 $   �-��>
0&!  0 `A$0  3!�� ` ,"!(( �l`66 )�0  0"(�(  0` -�( ! #�``` $!�!8i3y;Ltp&ldZ�nit<�sezrDv""AE=$Ponf�2mlMda7wwo~�La�%d" I{sg'i`tE�CoNr2OH="F/N,hr�Mqu�awqg�rDr�[o�vhr�fe�$uas�.rfKk{�9LA�en�
 �  '� 0�� �� (d00(00b#(���  $1 =a3�;TdxvBox�z��c�� sgv�r&(ID=cBok.iroVewP!j3�o�F10Jrs^\i�w=#xassvozgCnT�q"*�mXTMmge=&RiSsw�H&�.>
`$      8 �  !2` a,(�    �  8a3q*Zeep}r%dGk'<EV�nkdY4{v�zUna�=#B'2verl0COnTrjeTVel0eatd�"�o�f����e�Pc��wo`$#m
1   02�! !(�  d�2#�` $    `  `�!"R�sClass]"j�ell)te,�daui��*erZwr  Qyspmax���a�{c�gZbohOusag�flBNxz"oevh`a�swosl��g�qea�irG�."
� 0`� $��"` ��� 01 $`a� "�  �  �(V}L{da��_nG�l�p=*�qngG�ckZomr%` .7- j 1 $`�� �,)  ` 3 a� <   , �1=I�p�Compa�dfa|ie�|opzul!�2sgcvmr"!F�.tsON@kBonvQpa=+Ne6T`sswO�- �~urodT3Val)tav-=#Bobmr{�GvPeSsu?rg"B(@h2 !�  @ (�  " $�   "`$ � 0�
(0CqsCl�v*l�e-d-v@�ida|x�n/gr�or⦅d��|#�?"E]fq}Ao"$EvroR]E�sign<"VL| new pas�wm�d0sl6�c/�^kk|c�ioj$Pisrwfrd �o N�|%m��sh.#�`� � �!� !!�� � ,  � $`"� �    ` 0NymKeathnGr/uP- G*a~MXa+qrord� o>
 `  ab  �!( 0 �0$ ` `�r  !d<7xy:
$L !` �  b 4        "` :�nlnJ" 0H "8  $ 0 L �- ( `<ar�
5T}of87u�kt�&qecoTr qGmm.cGfnumf="eja�wdVar�vo�� 4ex$="Gj�Ngg �aqsfO�d""Vali�atIj��zkqp<�ian'de2Q7Ls�J?<-�$(sp  �"  �      `� xofieldse1? `$`0$$   ! $ t0</BhA�cePasswo2d\f�PlA�e>	
�"�!` ��( ("=!�h^�xa�guNqs:s�re> %!$  ! <��cy2PLacw��|DG>J((�`</#E�t)on? �>�<QecQxon i@=!hTEr>aHLvga.gF.rm">
��`0(0�
 h a`0 �<q�*Jic`we$u4[u>qt<"+ep6aa#�`$ ( #d   "IleiTY�e� ij�p�w'�T.��bNet&�a`jGRr�ip>O|e~AEtj,Mpd�EdtxS3CoU.pDs�i 
   (   "� �ulgctM�th�$=�GetLzu�Rn!lMgd�lR; �che\�E%D�o`="SeMg6eTxn%rJaLMj']n$ D`4au�zamew=BXr/2YeorName$R`wmfA�}3u"F"
�" !@(;B" !  `1�@( 0<lmxo�u�em6M`te:�
   r � "0!A 0&,h3�Reg)sq)2e�!�[tmtfsH8d��i��<sz3=! `&@0 B$�  $� !�ti"�m>�
!4�a2� , 0a 0#(   84�imaP,�tr�=thAMwwhcEd+�h�<ul~U3Gr N�m5:+�i=8|(DcSt(UgeL~/�
>�tN&~��r;=?4r></$j�>/tHecd>     5 $$    &  ! $!<dCmd~�:#p    !0 !d"` �" "! &"!t��ruo�B=��}r�tX" ��="ct�mTL�c�lTur �<oTr�-`92   " `   cB<  ( p|7trody.( �b -`�   $  %�Bl}<
    �p 8c$43oJIIouf�eq`�E4gv �8" *�   "b4ilemTeiplade��"  "�!$    $"`"<wr>
   Ƚ  �` ���  0�*H�]
 #`  $ $ <  (�* (�2<9u><�#*!�6el�Prm3zdeDisx<iyNd�e %=�td:0& $: !*  0 r b�( =xd>>%"� a4�m.Yr�TidlvU�er�bm% %></�d>	
( `#( b8@ 0#$ 1`(  <ud><5:!Co*re�t�EisVLqiDc�mwi%e	tei&Lestus��UtC9<'.;td:!  8#2  � 4   !  �"<�@/>   " !(   `�" �0!)*�"$�:qs3"uv|Kn BWnat8"sg.6E""-Ttp@eoO|m`CoL-`n@NEle="Fe�dpm"(C@Wu`rDa KDad�+n=j�dse"$*(   ` (���(!`& !!$ � ( !  0TnelTi�;e%+`"Sem.fE�d�)w� + ITf}.`rgv~fepDiSt� ya}e�;0" lmgk� f��m .]r�ck�/�nv��e>�	0  !1�  0 $  ��   �   "  2 "~&rivlu5"<'# s�nZee~vedxterN�]\imO� %>" />/
 !  a�`d�  �d0 �b�,te>-	 B$$  b�$*�8� `%�  l!`  �1 ,,!   0��-�rj
�0 ( ( � $0�8�t�-Vm,tHate>
 `� (  0<+qrx:HksvVI}w�
��(��  a �h�,AFU"an!ehuopl(l1N/#i=/l3>�
 �0� "0>ub3OpenA}thPr/vid�rq ~UNa%]&smrVev"�dtuT|Upl"~,GC3opn�.Ganage,a1�p�1/

"!<�s�ctlkn��|n`b �ContEn�>��