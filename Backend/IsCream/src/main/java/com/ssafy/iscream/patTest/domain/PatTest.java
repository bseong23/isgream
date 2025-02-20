package com.ssafy.iscream.patTest.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "pat_test")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pat_test_id")
    private Integer patTestId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "test_date", nullable = false)
    private LocalDate testDate;

    @Column(name = "a_score", nullable = false)
    private Integer aScore;

    @Column(name = "b_score", nullable = false)
    private Integer bScore;

    @Column(name = "c_score", nullable = false)
    private Integer cScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResultType result;

    @Column(name = "pdf_url")
    private String pdfUrl;

    public enum ResultType {
        A("""
A형 : 허용형/익애적 양육태도
                
당신은 자녀에 대해 허용적 태도를 지니고 있습니다. 마치 아이를 성인으로 대하듯 아이에게 스스로 결정하도록 허락하는 사람입니다.
아이에게 어떤 규칙들을(예를들면, 잠자는 시간이나 먹어야할 음식의 종류 등) 강요하지 않습니다.
하지만 이러한 것들이 지나치면 장래에 당신의 자녀는 규칙을 따르는데 문제가 있을 수 있습니다.
아이들도 수용할 준비가 되어 있지 않은 결과들에 대해서도 결정을 해야 할 수 있습니다.
                
이런 부모 밑에서 자란 아이는 다음과 같은 특성을 지닐 수 있습니다.
           
어른에게 저항, 불복종/경격적/자기에 대한 낮은 신뢰성/쉽게 화내지만 회복도 빠름/낮은 성취지향성/충동적/약한 자기 통제력/목적이 없거나 목표 지향적 활동이 적음/지배적
"""
        ),
        B("""
B형 : 권위주의적 양육태도

당신은 아마도 자녀에게 많은 것을 요구하면서도 당신은 자녀에게 해주는 것이 별로 없어보입니다.
가정 분위기는 매우 엄격하게 통제되어 있는 듯 싶습니다. 아이는 아마도 성장하면서 어떤 보호도 없이 상실감을 맛보게 될 수도 있으며, 의사결정 시에 자기 확신감이 부족할 수도 있습니다.

이런 부모 밑에서 자란 아이는 다음과 같은 특성을 지닐 수 있습니다.

공포와 두려움이 많음/스트레스를 쉽게 받음/우울하고 불쾌한 정서/목적이 없음/쉽게 초조해짐/공격적인 행동과 무뚝뚝하고 무관심한 행동이 번걸아 나타남/겉으로 들어나진 않으나 배타적임
"""),
        C("""
C형 : 민주적/균형잡힌 양육태도

당신은 아이에게 요구하는만큼 당신도 자녀에게 돌려주는 타입입니다.
아이와 함께 대화를 통해 타협하며 아이에게 확신감과 스스로 자신을 통제하는 방법을 길러주는 부모입니다. 부모와 자녀와의 관계는 존경에 바탕을 두고 있습니다.
자녀는 이러한 가정 분위기 속에서 사회에 적응할 수 있는 능력을 자연스레 배워나가며 긍정적인 자아상을 지니게 될 것입니다.

이런 부모 밑에서 자란 아이는 다음과 같은 특성을 지닐 수 있습니다.

자기 신뢰적/높은 스트레스 대처 능력/자기 통제적/새로운 상황에 대한 흥미와 호기심/활동수준이 높음/성인에 대해 협조적/쾌활/목적지향적/또래 친구와 잘 사귐/성취지향적
""");

        private final String description;

        ResultType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }
}
