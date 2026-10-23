type SkillVisualProps = {
  index: number;
};

export function SkillVisual({ index }: SkillVisualProps) {
  const blue = "#91baff";
  const violet = "#b3a0ff";

  return (
    <svg viewBox="0 0 320 160" fill="none" aria-hidden="true" focusable="false">
      {index === 0 && (
        <>
          <path d="M28 133H291M42 141H270" stroke={blue} strokeOpacity=".12" />
          <g transform="translate(58 27)">
            <rect width="208" height="109" rx="7" fill={blue} fillOpacity=".035" stroke={blue} strokeOpacity=".6" />
            <path d="M0 19H208" stroke={blue} strokeOpacity=".35" />
            <circle cx="11" cy="10" r="2" fill={violet} fillOpacity=".8" />
            <circle cx="19" cy="10" r="2" fill={blue} fillOpacity=".5" />
            <circle cx="27" cy="10" r="2" fill={blue} fillOpacity=".25" />
            <path d="M149 9H193" stroke={blue} strokeOpacity=".25" strokeLinecap="round" />
            <rect x="12" y="32" width="38" height="63" rx="3" fill={violet} fillOpacity=".055" stroke={violet} strokeOpacity=".2" />
            <path d="M21 43H39M21 52H34M21 61H37M21 80H32" stroke={violet} strokeOpacity=".5" strokeLinecap="round" />
            <path d="M64 37H125M64 45H102" stroke={blue} strokeOpacity=".7" strokeLinecap="round" />
            <rect x="64" y="59" width="57" height="36" rx="3" stroke={blue} strokeOpacity=".3" />
            <rect x="129" y="59" width="65" height="36" rx="3" stroke={blue} strokeOpacity=".3" />
            <path className="v2-sv-flow" d="M73 85L83 76L92 80L104 67L112 71" stroke={blue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M138 73H182M138 80H169M138 87H176" stroke={blue} strokeOpacity=".3" strokeLinecap="round" />
          </g>
          <g className="v2-sv-float">
            <rect x="31" y="69" width="55" height="46" rx="5" fill="#111529" stroke={violet} strokeOpacity=".75" />
            <path d="M45 84L40 90L45 96M71 84L76 90L71 96M62 81L54 99" stroke={violet} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g className="v2-sv-float" style={{ animationDelay: "-2s" }}>
            <rect x="231" y="15" width="54" height="41" rx="5" fill="#111529" stroke={blue} strokeOpacity=".8" />
            <path d="M243 29H271M243 36H261M243 43H266" stroke={blue} strokeOpacity=".7" strokeLinecap="round" />
            <circle cx="277" cy="18" r="5" fill="#111529" stroke={violet} />
          </g>
        </>
      )}

      {index === 1 && (
        <>
          <path d="M37 124L160 152L285 123M37 111L160 140L285 110" stroke={blue} strokeOpacity=".1" />
          <path className="v2-sv-flow" d="M77 71V106L160 128L243 106V72M160 93V128" stroke={blue} strokeOpacity=".65" strokeDasharray="3 5" />
          <g className="v2-sv-float">
            <path d="M66 83L160 59L254 83L160 109L66 83Z" fill={blue} fillOpacity=".055" stroke={blue} strokeOpacity=".6" />
            <path d="M66 83V92L160 118L254 92V83M160 109V118" stroke={blue} strokeOpacity=".35" />
            <path d="M119 84L160 73L202 84L160 96L119 84Z" stroke={violet} strokeOpacity=".55" />
          </g>
          <g className="v2-sv-float" style={{ animationDelay: "-1.5s" }}>
            <path d="M66 57L160 33L254 57L160 83L66 57Z" fill="#111529" stroke={violet} strokeOpacity=".75" />
            <path d="M66 57V66L160 92L254 66V57M160 83V92" stroke={violet} strokeOpacity=".4" />
            <path d="M105 57L160 43L216 57M118 61L160 50L202 61M132 65L160 58L188 65" stroke={violet} strokeOpacity=".4" />
          </g>
          <g className="v2-sv-float" style={{ animationDelay: "-3s" }}>
            <path d="M93 31L160 14L227 31L160 49L93 31Z" fill="#111529" stroke={blue} strokeOpacity=".8" />
            <path d="M93 31V39L160 58L227 39V31M160 49V58" stroke={blue} strokeOpacity=".45" />
            <path d="M144 28L160 24L177 28L160 33L144 28ZM144 35L160 39L177 35" stroke={blue} strokeOpacity=".8" />
          </g>
          <circle cx="77" cy="106" r="3" fill={blue} />
          <circle cx="243" cy="106" r="3" fill={violet} />
          <circle cx="160" cy="128" r="3" fill={blue} />
        </>
      )}

      {index === 2 && (
        <>
          <path d="M61 36C105 36 94 80 144 80M61 80H144M61 124C105 124 94 80 144 80M176 80C220 80 216 38 257 38M176 80H257M176 80C220 80 216 122 257 122" stroke={blue} strokeOpacity=".25" />
          <path className="v2-sv-flow" d="M61 36C105 36 94 80 144 80M61 124C105 124 94 80 144 80M176 80C220 80 216 38 257 38M176 80C220 80 216 122 257 122" stroke={violet} strokeOpacity=".8" strokeDasharray="4 9" />
          {[24, 68, 112].map((y, row) => (
            <g key={y}>
              <rect x="33" y={y} width="29" height="25" rx="4" fill={blue} fillOpacity=".035" stroke={blue} strokeOpacity=".55" />
              <path d={`M40 ${y + 8}H54M40 ${y + 13}H50M40 ${y + 18}H${row === 1 ? 55 : 52}`} stroke={blue} strokeOpacity=".6" strokeLinecap="round" />
            </g>
          ))}
          <g className="v2-sv-float">
            <path d="M160 51L185 66V94L160 109L135 94V66L160 51Z" fill="#111529" stroke={violet} strokeOpacity=".75" />
            <path d="M160 61L176 70V89L160 99L144 89V70L160 61Z" stroke={blue} strokeOpacity=".3" />
            <path d="M149 80L156 87L171 72" stroke={blue} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="135" cy="80" r="3" fill={violet} />
            <circle cx="185" cy="80" r="3" fill={blue} />
          </g>
          {[38, 80, 122].map((y, node) => (
            <g key={y}>
              <circle cx="266" cy={y} r="11" fill={node === 1 ? violet : blue} fillOpacity=".04" stroke={node === 1 ? violet : blue} strokeOpacity=".65" />
              <circle cx="266" cy={y} r="3" fill={node === 1 ? violet : blue} fillOpacity=".8" />
              <path d={`M283 ${y - 3}H296M283 ${y + 3}H291`} stroke={blue} strokeOpacity=".3" strokeLinecap="round" />
            </g>
          ))}
          <path d="M115 29L119 33M119 29L115 33M203 121L207 125M207 121L203 125" stroke={violet} strokeOpacity=".45" strokeLinecap="round" />
        </>
      )}

      {index === 3 && (
        <>
          <path d="M35 119H285" stroke={blue} strokeOpacity=".1" />
          <path className="v2-sv-flow" d="M65 57H112C122 57 123 99 136 99H183C195 99 195 57 209 57H254" stroke={blue} strokeOpacity=".7" strokeDasharray="4 5" />
          <g className="v2-sv-float">
            <rect x="30" y="36" width="61" height="43" rx="5" fill="#111529" stroke={blue} strokeOpacity=".65" />
            <path d="M30 48H91" stroke={blue} strokeOpacity=".25" />
            <circle cx="38" cy="42" r="1.5" fill={violet} />
            <circle cx="44" cy="42" r="1.5" fill={blue} fillOpacity=".5" />
            <path d="M40 56L45 61L40 66M51 66H64" stroke={blue} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g>
            <rect x="132" y="78" width="49" height="43" rx="5" fill="#111529" stroke={violet} strokeOpacity=".65" />
            <path d="M144 91H169M144 99H169M144 107H158" stroke={violet} strokeOpacity=".55" strokeLinecap="round" />
            <circle cx="164" cy="107" r="2" fill={blue} />
          </g>
          <g className="v2-sv-float" style={{ animationDelay: "-2s" }}>
            <path d="M234 38L255 27L276 38V63L255 76L234 63V38Z" fill="#111529" stroke={blue} strokeOpacity=".8" />
            <path d="M234 38L255 50L276 38M255 50V76M244 33L265 45" stroke={blue} strokeOpacity=".45" />
            <circle cx="276" cy="70" r="9" fill="#111529" stroke={violet} strokeOpacity=".8" />
            <path d="M272 70L275 73L280 67" stroke={violet} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <path d="M60 87V101H112M207 101H255V84" stroke={violet} strokeOpacity=".2" strokeDasharray="2 4" />
          <circle cx="111" cy="57" r="2.5" fill={blue} />
          <circle cx="209" cy="57" r="2.5" fill={violet} />
          <path d="M44 133H77M140 140H174M241 123H274" stroke={blue} strokeOpacity=".2" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
