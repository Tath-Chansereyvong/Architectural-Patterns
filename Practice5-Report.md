## Student Name: Tat Chansereyvong ID: p20230021
## Lecturer: Mr. Chhun Thavorac

# Practice 5: Scalability and Performance in K8s

## 1. SLO/SLI Definition (P95 Target)
Service Level Objective (SLO):
The measurable performance goal defined for the system. In this lab, the objective is to maintain P95 latency ≤ 400ms under normal load conditions.

Service Level Indicator (SLI):
The actual metrics collected to evaluate system performance. The key SLIs measured in this lab include:

- P95 latency

- P99 latency

- Requests Per Second (RPS)

- Error rate (%)

Target Definition:
At least 95% of all requests must complete within 400ms. Any sustained violation indicates performance degradation and requires scaling or optimization.

---

## 2. Baseline vs After Improvements

| Metric | Baseline | With HPA | With Caching |
|--------|----------|----------|--------------|
| Replicas | 2 (fixed) | 2-10 (auto) | 2-10 (auto) |
| RPS | 1171.82 | 4368.96 | 5890.26 |
| P95 Latency | ~181.4ms | ~121.74ms | ~205ms |
| P99 Latency | 206.85ms | 151.25ms | 353.20ms |
| Errors | None | None | None |

*P95 calculated from P90 and P99 data

---

## 3. Why HPA Helped

The Horizontal Pod Autoscaler (HPA) improved performance by automatically adjusting the number of running pods based on CPU utilization. In this lab, the target CPU usage was set to 65%. When traffic increased and CPU usage rose above the threshold, HPA automatically scaled up the number of replicas, allowing the workload to be distributed across more pods. This prevented individual pods from becoming overloaded and reduced response times. When traffic decreased, HPA scaled the number of pods back down to conserve resources. By dynamically scaling according to demand, HPA helped maintain stable latency and reduced the risk of performance bottlenecks during high traffic.

---

## 4. Why Caching Helped

Caching improved performance by reducing the need to repeatedly execute a slow operation that takes approximately 500ms to compute. Without caching, every request triggered the full computation process, which increased CPU usage and kept response times high. After implementing Redis caching with a 15-second TTL, the first request stored the computed result in memory. Subsequent requests were served directly from the cache in less than 10ms. This significantly reduced CPU load and improved response times. As a result, both P95 and P99 latencies decreased dramatically because most requests were fulfilled from the cache instead of being recomputed.